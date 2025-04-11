import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';
import { SecureWebhookService } from '@/utils/encryption';

// GET single webhook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
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

    // Format response to match frontend expectations
    return NextResponse.json({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      secret: webhook.secret,
      is_active: webhook.is_active,
      notify_email: webhook.notify_email,
      notify_slack: webhook.notify_slack,
      email_config: webhook.email_config,
      slack_config: webhook.slack_config,
      platformConfig: webhook.platformConfig,
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
  try {
    const id = (await params).id;
    const updates = await request.json();
    const supabase = createClient();

    // If updating platform config for custom platform, ensure secret is encrypted
    if (updates.platformConfig && updates.platform === 'custom') {
      const webhookSecret = updates.platformConfig.webhook_token;
      if (webhookSecret) {
        const encryptedSecret = await SecureWebhookService.storeWebhookSecret(
          id,
          webhookSecret,
        );
        updates.secret = encryptedSecret;
      }
    }

    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: webhook, error } = await (await supabase)
      .from('webhooks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;

    // Format response to match frontend expectations
    return NextResponse.json({
      id: webhook[0].id,
      name: webhook[0].name,
      url: webhook[0].url,
      secret: webhook[0].secret,
      is_active: webhook[0].is_active,
      notify_email: webhook[0].notify_email,
      notify_slack: webhook[0].notify_slack,
      email_config: webhook[0].email_config,
      slack_config: webhook[0].slack_config,
    });
  } catch (error) {
    console.error('Update webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 },
    );
  }
}

// DELETE webhook
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
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
