import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateQueryEmbedding } from '../../../lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { query, user_id, match_threshold = 0.6, match_count = 8 } = body;

    if (!query || !user_id) {
      return NextResponse.json(
        { error: 'Query and user_id required' },
        { status: 400 },
      );
    }

    // Check search limits
    const { data: limitCheck, error: limitError } = await (
      await supabase
    ).rpc('check_ai_limits', {
      user_id_param: user_id,
      operation_type: 'search',
    });

    if (limitError || !limitCheck?.[0]?.allowed) {
      return NextResponse.json(
        {
          error: 'Search limit exceeded',
          used: limitCheck?.[0]?.used || 0,
          limit: limitCheck?.[0]?.limit_amount || 0,
        },
        { status: 429 },
      );
    }

    // Generate query embedding
    const queryEmbedding = await generateQueryEmbedding(query);

    // Search for similar notification logs
    const { data: results, error } = await (
      await supabase
    ).rpc('search_similar_notifications', {
      query_embedding: queryEmbedding,
      user_id_param: user_id,
      match_threshold,
      match_count,
    });

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    return NextResponse.json({
      results: results || [],
      query,
      total_found: results?.length || 0,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
