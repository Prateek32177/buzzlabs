import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { SecureWebhookService } from '@/utils/encryption';

// GET single webhook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    const decryptedToken = await SecureWebhookService.getWebhookSecret(id);
    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: decryptedToken,
      isActive: webhook.is_active,
      notifyEmail: webhook.notify_email,
      notifySlack: webhook.notify_slack,
      emailConfig: webhook.email_config,
      slackConfig: webhook.slack_config,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching webhook' },
      { status: 500 },
    );
  }
}

// PATCH update webhook
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .update(json)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    const decryptedToken = await SecureWebhookService.getWebhookSecret(id);
    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: decryptedToken,
      isActive: webhook.is_active,
      notifyEmail: webhook.notify_email,
      notifySlack: webhook.notify_slack,
      emailConfig: webhook.email_config,
      slackConfig: webhook.slack_config,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating webhook' },
      { status: 500 },
    );
  }
}

// DELETE webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting webhook' },
      { status: 500 },
    );
  }
}
