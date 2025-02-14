import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET single webhook
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
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
      .eq('id', params.id)
      .eq('user_id', user.id)
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
      { error: 'Error fetching webhook' },
      { status: 500 },
    );
  }
}

// PATCH update webhook
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    // Convert frontend field names to database field names
    const updates = {
      name: json.name,
      is_active: json.isActive,
      notify_email: json.notifyEmail,
      notify_slack: json.notifySlack,
      email_config: json.email_config,
      slack_config: json.slack_config,
      updated_at: new Date().toISOString(),
    };

    const { data: webhook, error } = await supabase
      .from('webhooks')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
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
      { error: 'Error updating webhook' },
      { status: 500 },
    );
  }
}

// DELETE webhook
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
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
      .eq('id', params.id)
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
