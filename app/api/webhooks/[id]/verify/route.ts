import { WebhookVerificationService } from '@/lib/webhooks';
import { supabaseCont } from '@/utils/supabase/client';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';
import { v4 as uuidv4 } from 'uuid';
import { WebhookPlatform } from '@/lib/webhooks/types';
import { trackUsage } from '@/lib/analytics/usage';

// Import the rate limit checking function
import { checkUsageLimits } from '@/lib/analytics/usage';

class PlatformDetector {
  static detectFromHeaders(headers: Headers): string | null {
    if (headers.get('x-github-event')) return 'github';
    if (headers.get('Stripe-Signature')) return 'stripe';
    if (headers.get('svix-id') && headers.get('svix-timestamp')) return 'clerk'; // Clerk uses Svix

    // Supabase webhook headers
    if (headers.get('x-webhook-token')) return 'supabase';
    if (headers.get('x-webhook-id')) return 'supabase';

    return null;
  }

  static detectFromUrl(url: string): string | null {
    // Check URL patterns
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // Some platforms might embed their name in the URL
    const lastPathPart = pathParts[pathParts.length - 1].toLowerCase();

    // Common patterns
    if (lastPathPart === 'github') return 'github';
    if (lastPathPart === 'stripe') return 'stripe';
    if (lastPathPart === 'clerk') return 'clerk';
    if (lastPathPart === 'supabase') return 'supabase';
    if (lastPathPart === 'vercel') return 'vercel';
    if (lastPathPart === 'polar') return 'polar';

    return null;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const startTime = Date.now();
  const logId = uuidv4();
  let data: any;

  const url = new URL(req.url);
  const utmSource = url.searchParams.get('utm_source');

  let detectedPlatform = PlatformDetector.detectFromHeaders(req.headers);

  if (utmSource) {
    detectedPlatform = utmSource.toLowerCase() as WebhookPlatform;
  }

  if (!detectedPlatform) {
    detectedPlatform = PlatformDetector.detectFromUrl(req.url);
  }

  detectedPlatform = detectedPlatform || 'unknown';

  // Initialize usage metrics
  const usageMetrics = {
    userId: '',
    webhookId: id,
    requestCount: 1,
    emailCount: 0,
    slackCount: 0,
    payloadSize: 0,
    responseTimeMs: 0,
    platform: detectedPlatform,
    status: 'pending',
  };

  try {
    const supabase = supabaseCont();

    const clonedReq = req.clone();
    data = await clonedReq.json();

    // Track payload size (useful for rate limiting based on data volume)
    usageMetrics.payloadSize = new TextEncoder().encode(
      JSON.stringify(data),
    ).length;

    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .select('*')
      .eq('id', id);
    if (error || !webhook || webhook.length === 0) {
      usageMetrics.status = 'failed';
      await trackUsage(usageMetrics);

      return Response.json(
        { error: `Webhook not found ${error?.message}` },
        { status: 404 },
      );
    }

    // Set user ID for usage tracking
    usageMetrics.userId = webhook[0].user_id;

    // Check if the user has reached their usage limits
    const { hasReachedLimit, currentUsage } = await checkUsageLimits(
      webhook[0].user_id,
    );

    if (hasReachedLimit) {
      const log = {
        id: logId,
        webhook_id: id,
        webhook_name: webhook[0].name || 'Unknown',
        platform: detectedPlatform || 'Unknown',
        channel: '',
        status: 'failed' as const,
        payload: data,
        error_message: 'Rate limit exceeded',
        processed_at: new Date(),
      };

      await fetch(`${process.env.PROD_URL}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      // Track rate limit exceeded
      usageMetrics.status = 'failed';
      await trackUsage(usageMetrics);

      return Response.json(
        {
          error: 'Rate limit exceeded',
          currentUsage,
          message:
            'You have reached your daily usage limit. Please upgrade your plan for higher limits.',
        },
        { status: 429 },
      );
    }

    const verificationConfig = {
      platform: webhook[0].platform || detectedPlatform,
      secret: getSecretForPlatform(webhook[0], detectedPlatform),
      toleranceInSeconds: 300,
    };
    const verificationResult = await WebhookVerificationService.verify(
      req,
      verificationConfig,
    );

    if (!verificationResult.isValid) {
      const log = {
        id: logId,
        webhook_id: id,
        webhook_name: webhook[0].name || 'Unknown',
        platform: detectedPlatform || 'Unknown',
        channel: '',
        status: 'failed' as const,
        payload: data,
        error_message: verificationResult.error,
        processed_at: new Date(),
      };

      await fetch(`${process.env.PROD_URL}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      // Track verification failure
      usageMetrics.status = 'failed';
      await trackUsage(usageMetrics);

      return Response.json(
        { error: verificationResult.error },
        { status: 401 },
      );
    }

    let status: 'success' | 'pending' | 'failed' = 'pending';
    let channels: string[] = [];
    let errorMessage = '';

    if (webhook[0].is_active) {
      if (webhook[0].notify_email) {
        try {
          await sendEmail({
            userId: webhook[0].user_id,
            from: 'Superhook Alerts <alerts@brokersify.in>',
            to: webhook[0].email_config.recipient_email,
            templateId: webhook[0].email_config.template_id,
            data,
          });
          channels.push('email');
          usageMetrics.emailCount = 1; // Track email notification
          status = 'success';
        } catch (err) {
          const error = err as Error;
          errorMessage += `Email error: ${error.message}; `;
          status = 'failed';
        }
      }

      if (webhook[0].notify_slack) {
        try {
          await sendSlackNotification({
            userId: webhook[0].user_id,
            webhookUrl: webhook[0].slack_config.webhook_url,
            channelName: webhook[0].slack_config.channel_name,
            templateId: webhook[0].slack_config.template_id,
            data,
          });
          channels.push('slack');
          usageMetrics.slackCount = 1; // Track slack notification
          status = 'success';
        } catch (err) {
          const error = err as Error;
          errorMessage += `Slack error: ${error.message}; `;
          status = 'failed';
        }
      }

      const log = {
        id: logId,
        webhook_id: id,
        webhook_name: webhook[0].name || 'Unknown',
        platform: detectedPlatform,
        channel: channels.join(','),
        status,
        payload: data,
        email_sent: channels.includes('email'),
        email_recipient: webhook[0].notify_email
          ? webhook[0].email_config.recipient_email
          : undefined,
        slack_sent: channels.includes('slack'),
        slack_channel: webhook[0].notify_slack
          ? webhook[0].slack_config.channel_name
          : undefined,
        error_message: errorMessage || undefined,
        processed_at: new Date(),
      };

      await fetch(`${process.env.PROD_URL}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
    }

    // Calculate response time
    usageMetrics.responseTimeMs = Date.now() - startTime;
    usageMetrics.status = status;

    // Track the usage metrics
    await trackUsage(usageMetrics);

    return Response.json({
      success: true,
      message: 'Webhook processed successfully',
      platform: detectedPlatform,
    });
  } catch (error) {
    const err = error as Error;
    const log = {
      id: logId,
      webhook_id: id,
      webhook_name: 'Unknown',
      platform: detectedPlatform,
      channel: '',
      status: 'failed' as const,
      payload: data || {},
      error_message: `Failed to process webhook: ${err.message}`,
      processed_at: new Date(),
    };

    try {
      await fetch(`${process.env.PROD_URL}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      // Track error in metrics
      usageMetrics.status = 'failed';
      usageMetrics.responseTimeMs = Date.now() - startTime;
      await trackUsage(usageMetrics);
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    return Response.json(
      { error: `Failed to process webhook: ${err.message}` },
      { status: 500 },
    );
  }
}

function getSecretForPlatform(webhook: any, detectedPlatform: string): string {
  // Use platform-specific secrets when available
  switch (detectedPlatform) {
    case 'clerk':
      return webhook.platformConfig[detectedPlatform].signing_secret;
    case 'stripe':
      return webhook.platformConfig[detectedPlatform].signing_secret;
    case 'github':
      return webhook.platformConfig[detectedPlatform].signing_secret;
    case 'supabase':
      return webhook.platformConfig[detectedPlatform];
    default:
      if (!webhook.secret) {
        throw new Error('Webhook secret is missing');
      }
      return webhook.secret;
  }
}
