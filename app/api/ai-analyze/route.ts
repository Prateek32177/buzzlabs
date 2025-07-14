// app/api/ai-analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { queryGroqAI } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createClient();
    const { query, user_id, context = [] } = body;

    if (!query || !user_id) {
      return NextResponse.json(
        { error: 'Query and user_id required' },
        { status: 400 },
      );
    }

    // Check AI limits
    // const { data: limitCheck, error: limitError } = await (
    //   await supabase
    // ).rpc('check_ai_limits', {
    //   user_id_param: user_id,
    //   operation_type: 'analysis',
    // });

    // if (limitError || !limitCheck?.[0]?.allowed) {
    //   return NextResponse.json(
    //     {
    //       error: 'AI analysis limit exceeded',
    //       used: limitCheck?.[0]?.used || 0,
    //       limit: limitCheck?.[0]?.limit_amount || 0,
    //     },
    //     { status: 429 },
    //   );
    // }

    try {
      // Build context from search results
      const contextText =
        context.length > 0
          ? context
              .map((log: any) => {
                const parts = [
                  `Platform: ${log.platform}`,
                  `Status: ${log.status}`,
                  `Webhook: ${log.webhook_name}`,
                  `Payload: ${log.payload ? JSON.stringify(log.payload) : 'N/A'}`,
                  `Time: ${new Date(log.processed_at).toLocaleString()}`,
                  `Email: ${log.email_sent ? 'Sent' : 'Failed'}`,
                  `Slack: ${log.slack_sent ? 'Sent' : 'Failed'}`,
                ];

                if (log.error_message) {
                  parts.push(`Error: ${log.error_message}`);
                }

                return parts.join(' | ');
              })
              .join('\n')
          : 'No relevant logs found for this query.';

      // Create comprehensive prompt for analysis
      const prompt = `You are a webhook logging and alerting system expert. Analyze the following webhook logs and provide insights based on the user's query.

User Query: "${query}"

Relevant Logs:
${contextText}

Please provide:
1. A clear analysis of what the logs reveal
2. Identify any patterns or issues
3. Suggest actionable solutions if problems are found
4. Be specific about webhook platforms, error types, and delivery success rates

Keep your response concise very short, to the point with data point not verbose response, focusing on practical insights that help debug and improve webhook reliability.`;

      // Get AI analysis
      const aiResponse = await queryGroqAI(prompt);

      // Generate practical suggestions based on the analysis
      const suggestions = generateSuggestions(context, query);

      return NextResponse.json({
        response: aiResponse,
        suggestions: suggestions,
      });
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      return NextResponse.json(
        { error: 'AI analysis failed' },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error('AI analyze API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

function generateSuggestions(context: any[], query: string): string[] {
  const suggestions: string[] = [];

  if (context.length === 0) {
    suggestions.push('Check if webhook endpoints are properly configured');
    suggestions.push('Verify webhook payload structure and authentication');
    suggestions.push('Review webhook URL accessibility and SSL certificates');
    return suggestions;
  }

  const failedCount = context.filter(log => log.status === 'failed').length;
  const emailFailures = context.filter(log => !log.email_sent).length;
  const slackFailures = context.filter(log => !log.slack_sent).length;

  if (failedCount > 0) {
    suggestions.push(
      `${failedCount} webhook deliveries failed - check endpoint availability and authentication`,
    );
  }

  if (emailFailures > 0) {
    suggestions.push(
      `${emailFailures} email notifications failed - verify SMTP configuration and recipient addresses`,
    );
  }

  if (slackFailures > 0) {
    suggestions.push(
      `${slackFailures} Slack notifications failed - check bot permissions and channel access`,
    );
  }

  // Platform-specific suggestions
  const platforms = [...new Set(context.map(log => log.platform))];
  if (platforms.includes('stripe')) {
    suggestions.push(
      'For Stripe webhooks, ensure endpoint signature verification is properly implemented',
    );
  }

  if (platforms.includes('github')) {
    suggestions.push(
      'For GitHub webhooks, verify webhook secret and payload format compatibility',
    );
  }

  if (platforms.includes('supabase')) {
    suggestions.push(
      'For Supabase webhooks, check database connection and authentication tokens',
    );
  }

  // Add rate limiting suggestion if many failures
  if (failedCount > context.length * 0.5) {
    suggestions.push(
      'Consider implementing exponential backoff and retry logic for failed webhooks',
    );
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

//     const prompt = `You are an expert webhook notification system debugger. Analyze the user's question and provide actionable insights based on the notification logs.

// User Question: "${query}"

// Relevant Notification Logs:
// ${contextText || 'No matching notification logs found.'}

// Instructions:
// - Be concise but comprehensive
// - Focus on actionable debugging steps
// - Identify patterns in failures or issues
// - Suggest specific solutions for common problems
// - Reference specific log IDs when discussing individual events
// - If no logs provided, give general webhook notification troubleshooting advice
// - Consider email/Slack delivery failures, payload issues, and timing problems
// - Provide next steps for investigation

// Analysis:`;
