import { WebhookVerificationService } from '@/lib/webhooks';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  try {
    const supabase = createClient();
    const data = await req.json();
    // Get webhook config from database including notification settings
    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .select('*')
      .eq('id', id);

    if (error || !webhook) {
      return Response.json(
        { error: `Webhook not found ${error.message}` },
        { status: 404 },
      );
    }

    // Verify webhook based on platform
    const verificationResult = await WebhookVerificationService.verify(req, {
      platform: webhook[0].platform || '',
      secret:
        webhook[0].platform === 'clerk'
          ? webhook[0].clerk_secret
          : webhook[0].secret,
      toleranceInSeconds: 300,
    });

    if (!verificationResult.isValid) {
      return Response.json(
        { error: verificationResult.error },
        { status: 401 },
      );
    }

    // Process verified webhook
    if (webhook[0].is_active) {
      if (webhook[0].notify_email) {
        await sendEmail({
          userId: webhook[0].user_id,
          from: 'Superhook Alerts <alerts@brokersify.in>',
          to: webhook[0].email_config.recipient_email,
          templateId: webhook[0].email_config.template_id,
          data: {
            type: 'webhook',
            payload: data,
          },
        });
      }

      // if (webhook[0].notify_slack) {
      //   await sendSlackNotification({
      //     webhookUrl: webhook[0].slack_config.webhook_url,
      //     channelName: webhook[0].slack_config.channel_name,
      //     templateId: webhook[0].slack_config.template_id,
      //     data: {
      //       webhookId: id,
      //       platform: verificationResult.platform,
      //       payload: verificationResult.payload,
      //       metadata: verificationResult.metadata,
      //       timestamp: new Date().toISOString(),
      //     },
      //   });
      // }
    }

    return Response.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json(
      { error: `Failed to process webhook ${JSON.stringify(error)}` },
      { status: 500 },
    );
  }
}
