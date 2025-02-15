import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';
import { SecureWebhookService } from '@/utils/encryption';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const authToken = req.headers.get('x-webhook-token');
    const supabase = createClient();

    // Get webhook config from database including notification settings
    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .select('*')
      .eq('id', params.id);

    if (error || !webhook) {
      return Response.json(
        { error: `Webhook not found ${error.message}` },
        { status: 404 },
      );
    }

    // Verify webhook token
    const decryptedToken = await SecureWebhookService.getWebhookSecret(
      params.id,
    );

    if (authToken !== decryptedToken) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get webhook payload
    const payload = await req.json();

    if (webhook[0].is_active && webhook[0].notify_email) {
      await sendEmail({
        from: 'alerts@brokersify.in',
        to: 'prateek56489@gmail.com',
        templateId: 'template1',
        data: {
          type: 'webhook',
          payload,
        },
      });
    } else if (webhook[0].is_active && webhook[0].notify_slack) {
      sendSlackNotification({
        webhookUrl: webhook[0].slack_config.webhook_url,
        channelName: webhook[0].slack_config.channel_name,
        templateId: webhook[0].slack_config.template_id,
        data: {
          webhookId: params.id,
          payload,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return Response.json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json(
      {
        error: `Notification failed ${error}`,
      },
      { status: 500 },
    );
  }
}
