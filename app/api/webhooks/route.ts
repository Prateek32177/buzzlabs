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

    if (error) throw error;

    // Map database fields to frontend expected format
    const formattedWebhooks = webhooks.map(webhook => ({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: webhook.secret,
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

    // Generate webhook secret
    const webhookSecret = WebhookSecurity.generateSecret();
    const webhookId = crypto.randomUUID();

    // Create webhook in database
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert({
        id: webhookId,
        user_id: user.id,
        name,
        url: `/api/webhooks/${webhookId}/verify`,
        secret: webhookSecret,
        is_active: true,
        notify_email: false,
        notify_slack: false,
        email_config: null,
        slack_config: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Format response to match frontend expectations
    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: webhook.secret,
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
