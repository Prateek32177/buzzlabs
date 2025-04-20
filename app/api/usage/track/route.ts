import { createServiceClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface UsageMetricsRequest {
  userId: string;
  webhookId: string;
  requestCount: number;
  emailCount: number;
  slackCount: number;
  payloadSize: number;
  responseTimeMs: number;
  platform: string;
  status: 'success' | 'failed' | 'pending';
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const apiKey = process.env.INTERNAL_API_SECRET;

    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 },
      );
    }

    // Get metrics data from request
    const metrics = (await req.json()) as UsageMetricsRequest;

    // Validate required fields
    if (!metrics.userId || !metrics.webhookId) {
      return NextResponse.json(
        { error: 'Invalid metrics data: missing required fields' },
        { status: 400 },
      );
    }

    // Create admin client with service role key
    const supabaseAdmin = createServiceClient();
    const today = new Date().toISOString().split('T')[0];

    // Get existing usage for today if any
    const { data: existingUsage, error: fetchError } = await (
      await supabaseAdmin
    )
      .from('usage_daily')
      .select('*')
      .eq('user_id', metrics.userId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Not found error is okay
      console.error('Error fetching existing usage:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch existing usage data' },
        { status: 500 },
      );
    }

    let result;

    if (existingUsage) {
      // Update existing record
      result = await (
        await supabaseAdmin
      )
        .from('usage_daily')
        .update({
          request_count: existingUsage.request_count + metrics.requestCount,
          email_count: existingUsage.email_count + metrics.emailCount,
          slack_count: existingUsage.slack_count + metrics.slackCount,
          total_payload_bytes:
            existingUsage.total_payload_bytes + metrics.payloadSize,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', metrics.userId)
        .eq('date', today);
    } else {
      // Create new record
      result = await (await supabaseAdmin).from('usage_daily').insert([
        {
          user_id: metrics.userId,
          date: today,
          request_count: metrics.requestCount,
          email_count: metrics.emailCount,
          slack_count: metrics.slackCount,
          total_payload_bytes: metrics.payloadSize,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    if (result.error) {
      console.error('Error updating usage data:', result.error);
      return NextResponse.json(
        { error: 'Failed to update usage data' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usage data updated successfully',
    });
  } catch (error) {
    console.error('Error processing usage tracking request:', error);
    return NextResponse.json(
      { error: 'Failed to process usage tracking request' },
      { status: 500 },
    );
  }
}
