// @/lib/analytics/usage.ts

import { getUser } from '@/hooks/user-auth';
import { createClient } from '@/utils/supabase/server';

// Import the getUserLimits function from our new service
import { getUserLimits, TierLimits } from '@/lib/subscription/limits';

// Define the structure of usage metrics
interface UsageMetrics {
  userId: string;
  webhookId: string;
  requestCount: number;
  emailCount: number;
  slackCount: number;
  payloadSize: number;
  responseTimeMs: number;
  platform: string;
  status: string;
}

/**
 * Track usage metrics for rate limiting and subscription purposes
 * Uses a database transaction to prevent race conditions with concurrent requests
 */
export async function trackUsage(metrics: UsageMetrics): Promise<void> {
  if (!metrics.userId) {
    console.warn('No user ID provided for usage tracking');
    return;
  }

  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Use PostgreSQL's atomic update to prevent race conditions
    const { error } = await supabase.rpc('increment_usage', {
      p_user_id: metrics.userId,
      p_date: today,
      p_request_count: metrics.requestCount,
      p_email_count: metrics.emailCount,
      p_slack_count: metrics.slackCount,
      p_payload_bytes: metrics.payloadSize,
    });

    if (error) {
      console.error('Failed to increment usage metrics:', error);

      // Fallback approach if the RPC fails
      // Get existing usage record for today if it exists
      const { data: existingUsage } = await supabase
        .from('usage_daily')
        .select('*')
        .eq('user_id', metrics.userId)
        .eq('date', today)
        .single();

      if (existingUsage) {
        // Update existing usage record
        await supabase
          .from('usage_daily')
          .update({
            request_count: existingUsage.request_count + metrics.requestCount,
            email_count: existingUsage.email_count + metrics.emailCount,
            slack_count: existingUsage.slack_count + metrics.slackCount,
            total_payload_bytes:
              existingUsage.total_payload_bytes + metrics.payloadSize,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUsage.id);
      } else {
        // Create new usage record for today
        await supabase.from('usage_daily').insert({
          user_id: metrics.userId,
          date: today,
          request_count: metrics.requestCount,
          email_count: metrics.emailCount,
          slack_count: metrics.slackCount,
          total_payload_bytes: metrics.payloadSize,
        });
      }
    }

    // Log detailed metrics for debugging and analysis
    await supabase.from('usage_logs').insert({
      user_id: metrics.userId,
      webhook_id: metrics.webhookId,
      platform: metrics.platform,
      request_count: metrics.requestCount,
      email_count: metrics.emailCount,
      slack_count: metrics.slackCount,
      payload_size: metrics.payloadSize,
      response_time_ms: metrics.responseTimeMs,
      status: metrics.status,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to track usage metrics:', error);
  }
}

export async function checkUsageLimits(userId: string): Promise<{
  hasReachedLimit: boolean;
  limitInfo: {
    requests: { current: number; limit: number; exceeded: boolean };
    dailyEmails: { current: number; limit: number; exceeded: boolean };
    dailySlackNotifications: {
      current: number;
      limit: number;
      exceeded: boolean;
    };
    dataVolume: { current: number; limitMB: number; exceeded: boolean };
    webhooks: { current: number; limit: number; exceeded: boolean };
    monthlyEmails: { current: number; limit: number; exceeded: boolean };
    monthlySlackNotifications: {
      current: number;
      limit: number;
      exceeded: boolean;
    };
  };
}> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = new Date().getFullYear();

    // Get user's subscription tier
    const user = await getUser();
    const tier = user?.subscription_tier || 'free';

    // Get user's limits (from database)
    const limits = await getUserLimits(userId, tier);

    // Get today's usage
    const { data: todayUsage } = await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    // Count active webhooks
    const { count: activeWebhooks } = await supabase
      .from('webhooks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get month-to-date email and slack usage
    const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
    const { data: monthUsage } = await supabase
      .from('usage_daily')
      .select('email_count, slack_count')
      .eq('user_id', userId)
      .gte('date', startOfMonth)
      .lte('date', today);

    // Calculate month-to-date totals
    let monthlyEmailCount = 0;
    let monthlySlackCount = 0;

    if (monthUsage) {
      monthUsage.forEach(day => {
        monthlyEmailCount += day.email_count || 0;
        monthlySlackCount += day.slack_count || 0;
      });
    }

    // Current usage metrics
    const currentUsage = {
      requests: todayUsage?.request_count || 0,
      dailyEmails: todayUsage?.email_count || 0,
      dailySlackNotifications: todayUsage?.slack_count || 0,
      totalDataVolume: todayUsage?.total_payload_bytes || 0,
      webhooks: activeWebhooks || 0,
      monthlyEmailCount,
      monthlySlackCount,
    };

    // Check if any limit is exceeded
    const limitInfo = {
      requests: {
        current: currentUsage.requests,
        limit: limits.dailyRequests,
        exceeded: currentUsage.requests >= limits.dailyRequests,
      },
      dailyEmails: {
        current: currentUsage.dailyEmails,
        limit: limits.dailyEmails,
        exceeded: currentUsage.dailyEmails >= limits.dailyEmails,
      },
      dailySlackNotifications: {
        current: currentUsage.dailySlackNotifications,
        limit: limits.dailySlackNotifications,
        exceeded:
          currentUsage.dailySlackNotifications >=
          limits.dailySlackNotifications,
      },
      dataVolume: {
        current: currentUsage.totalDataVolume,
        limitMB: limits.dailyDataVolumeMB,
        exceeded:
          currentUsage.totalDataVolume >=
          limits.dailyDataVolumeMB * 1024 * 1024,
      },
      webhooks: {
        current: currentUsage.webhooks,
        limit: limits.webhookLimit,
        exceeded: currentUsage.webhooks >= limits.webhookLimit,
      },
      monthlyEmails: {
        current: currentUsage.monthlyEmailCount,
        limit: limits.emailNotificationLimit,
        exceeded:
          currentUsage.monthlyEmailCount >= limits.emailNotificationLimit,
      },
      monthlySlackNotifications: {
        current: currentUsage.monthlySlackCount,
        limit: limits.slackNotificationLimit,
        exceeded:
          currentUsage.monthlySlackCount >= limits.slackNotificationLimit,
      },
    };

    const hasReachedLimit = Object.values(limitInfo).some(
      item => item.exceeded,
    );

    return {
      hasReachedLimit,
      limitInfo,
    };
  } catch (error) {
    console.error('Failed to check usage limits:', error);
    // Default to not rate limiting on error
    return {
      hasReachedLimit: false,
      limitInfo: {
        requests: { current: 0, limit: 100, exceeded: false },
        dailyEmails: { current: 0, limit: 20, exceeded: false },
        dailySlackNotifications: { current: 0, limit: 100, exceeded: false },
        dataVolume: { current: 0, limitMB: 10, exceeded: false },
        webhooks: { current: 0, limit: 5, exceeded: false },
        monthlyEmails: { current: 0, limit: 100, exceeded: false },
        monthlySlackNotifications: { current: 0, limit: 100, exceeded: false },
      },
    };
  }
}
