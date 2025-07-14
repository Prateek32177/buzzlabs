import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import {
  generateCohereEmbedding,
  createSearchableText,
} from '@/lib/embeddings';
import { NotificationLogType } from '@/lib/types/common';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const log: NotificationLogType = await req.json();

    if (!log.user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 },
      );
    }

    let embedding = null;
    let searchableText = null;
    let embeddingGenerated = false;

    try {
      searchableText = createSearchableText(log);

      if (searchableText && searchableText.trim().length > 0) {
        embedding = await generateCohereEmbedding(searchableText);
        embeddingGenerated = true;
      }
    } catch (embeddingError) {
      console.warn('Failed to generate embedding for log:', embeddingError);
    }

    // Prepare log data with embedding info
    const logWithEmbedding = {
      ...log,
      embedding,
      searchable_text: searchableText,
      embedding_generated: embeddingGenerated,
    };

    // Insert into notification_logs table
    const { error: logError, data: insertedLog } = await (await supabase)
      .from('notification_logs')
      .insert([logWithEmbedding])
      .select()
      .single();

    if (logError) {
      console.error('Error inserting notification log:', logError);
      return NextResponse.json(
        { error: 'Failed to insert notification log' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      log: insertedLog,
      embedding_generated: embeddingGenerated,
    });
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
