import { WebhookVerificationService } from '@/lib/webhooks';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const startTime = Date.now();
  const logId = uuidv4();
  let data: any;

  try {
    const supabase = createClient();
    data = await req.json();
    // Get webhook config from database
    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .select('*')
      .eq('id', id);
    if (error || !webhook || webhook.length === 0) {
      return Response.json(
        { error: `Webhook not found ${error?.message}` },
        { status: 404 },
      );
    }

    // Verify webhook
    const verificationResult = await WebhookVerificationService.verify(req, {
      platform: webhook[0].platform || '',
      secret:
        webhook[0].platform === 'clerk'
          ? webhook[0].clerk_secret
          : webhook[0].secret,
      toleranceInSeconds: 300,
    });

    if (!verificationResult.isValid) {
      const log = {
        id: logId,
        webhook_id: id,
        webhook_name: webhook[0].name || 'Unknown',
        platform: webhook[0].platform || 'unknown',
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

      return Response.json(
        { error: verificationResult.error },
        { status: 401 },
      );
    }

    // Process notifications
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
            data: { type: 'webhook', payload: data },
          });
          channels.push('email');
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
            data: {
              webhookId: id,
              payload: data,
              timestamp: new Date().toISOString(),
            },
          });
          channels.push('slack');
          status = 'success';
        } catch (err) {
          const error = err as Error;
          errorMessage += `Slack error: ${error.message}; `;
          status = 'failed';
        }
      }
    }

    const log = {
      id: logId,
      webhook_id: id,
      webhook_name: webhook[0].name || 'Unknown',
      platform: webhook[0].platform || 'unknown',
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

    return Response.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    const err = error as Error;
    const log = {
      id: logId,
      webhook_id: id,
      webhook_name: 'Unknown',
      platform: 'unknown',
      channel: '',
      status: 'failed' as const,
      payload: data,
      error_message: `Failed to process webhook: ${err.message}`,
      processed_at: new Date(),
    };
    await fetch(`${process.env.PROD_URL}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });

    return Response.json(
      { error: `Failed to process webhook: ${err.message}` },
      { status: 500 },
    );
  }
}
