import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

type WebhookLogData = {
  id: string;
  webhook_id: string;
  webhook_name: string;
  platform: string;
  channel: string;
  status: 'success' | 'pending' | 'failed';
  payload: any;
  email_sent?: boolean;
  email_recipient?: string;
  slack_sent?: boolean;
  slack_channel?: string;
  error_message?: string;
  processed_at: Date;
};

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const log: WebhookLogData = await req.json();

    // Insert into notification_logs table
    const { error: logError } = await (await supabase)
      .from('notification_logs')
      .insert([log]);

    if (logError) {
      console.error('Error inserting notification log:', logError);
      return NextResponse.json(
        { error: 'Failed to insert notification log' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing notification log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const webhookName = searchParams.get('webhook_name');

    const status = searchParams.get('status');

    let query = (await supabase)
      .from('notification_logs')
      .select('*')
      .order('processed_at', { ascending: false });

    if (webhookName) query = query.contains('webhook_name', webhookName);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notification logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notification logs' },
        { status: 500 },
      );
    }

    return NextResponse.json({ logs: data });
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
