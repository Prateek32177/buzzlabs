import { WebhookSecurity } from '@/utils/webhook-security';
import { Encryption } from '@/utils/encryption';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', user.id);

    if (!webhooks || webhooks.length === 0) {
      throw new Error('No webhooks found');
    }
    if (error) throw error;

    // Map database fields to frontend expected format
    const formattedWebhooks = await Promise.all(
      webhooks.map(async webhook => {
        let decryptedToken;
        try {
          decryptedToken = await Encryption.decrypt(webhook.secret);
        } catch (e) {
          decryptedToken = 'Decryption failed';
        }
        return {
          id: webhook.id,
          name: webhook.name,
          url: webhook.url,
          secret: decryptedToken,
          isActive: webhook.is_active,
          notifyEmail: webhook.notify_email,
          notifySlack: webhook.notify_slack,
          emailConfig: webhook.email_config,
          slackConfig: webhook.slack_config,
        };
      }),
    );

    return NextResponse.json(formattedWebhooks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, platform = 'custom' } = await req.json();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookSecret = WebhookSecurity.generateSecret();
    const webhookId = crypto.randomUUID();
    const encryptedSecret = await Encryption.encrypt(webhookSecret);

    // Create webhook
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        id: webhookId,
        user_id: user.id,
        name,
        platform,
        secret: encryptedSecret,
        platformConfig:
          platform === 'custom'
            ? {
                webhook_id: webhookId,
                webhook_token: webhookSecret,
              }
            : {},
        url: `/api/webhooks/${webhookId}/verify`,
        is_active: true,
        notify_email: false,
        notify_slack: false,
        email_config: null,
        slack_config: null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: webhookSecret,
      isActive: webhook.is_active,
      notifyEmail: webhook.notify_email,
      notifySlack: webhook.notify_slack,
      emailConfig: webhook.email_config,
      slackConfig: webhook.slack_config,
    });
  } catch (error) {
    console.error('Create webhook error:', error);
    return Response.json(
      { error: 'Failed to create webhook' },
      { status: 500 },
    );
  }
}
