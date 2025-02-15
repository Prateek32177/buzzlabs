import { WebhookSecurity } from '@/utils/webhook-security';
import { Encryption } from '@/utils/encryption';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { SecureWebhookService } from '@/utils/encryption';

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
      .eq('user_id', user.id)
      .limit(1);
    if (!webhooks || webhooks.length === 0) {
      throw new Error('No webhooks found');
    }
    const decryptedToken = await SecureWebhookService.getWebhookSecret(
      webhooks[0].id,
    );
    if (error) throw error;

    // Map database fields to frontend expected format
    const formattedWebhooks = webhooks.map(webhook => ({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: decryptedToken,
      isActive: webhook.is_active,
      notifyEmail: webhook.notify_email,
      notifySlack: webhook.notify_slack,
      emailConfig: webhook.email_config,
      slackConfig: webhook.slack_config,
    }));

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
    const { name } = await req.json();
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate and encrypt webhook secret
    const rawSecret = WebhookSecurity.generateSecret();
    const webhookId = crypto.randomUUID();
    const encryptedData = await Encryption.encrypt(rawSecret);
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        id: webhookId,
        user_id: user.id,
        secret: encryptedData,
        name,
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

    // Return decrypted secret to client
    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: rawSecret,
      isActive: webhook.is_active,
      notifyEmail: webhook.notify_email,
      notifySlack: webhook.notify_slack,
      emailConfig: webhook.email_config,
      slackConfig: webhook.slack_config,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create webhook ${JSON.stringify(error)}` },
      { status: 500 },
    );
  }
}
