import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type WebhookLogData = {
  webhook_id: string;
  platform: string;
  status: 'success' | 'error';
  payload: any;
  email_sent?: boolean;
  email_recipient?: string;
  slack_sent?: boolean;
  slack_channel?: string;
  error_message?: string;
  processed_at: Date;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const webhookId = (await params).id;
    const body = await request.json();
    const supabase = createClient();

    const logData: WebhookLogData = {
      webhook_id: webhookId,
      ...body,
      processed_at: new Date(),
    };

    const { error } = await (await supabase)
      .from('notification_logs')
      .insert([logData]);
    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error logging webhook:', error);
    return NextResponse.json(
      { error: 'Failed to log webhook event' },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const webhookId = (await params).id;
    const supabase = createClient();

    const { data, error } = await (await supabase)
      .from('notification_logs')
      .select('*')
      .eq('webhook_id', webhookId)
      .order('processed_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ logs: data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching webhook logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhook logs' },
      { status: 500 },
    );
  }
}
