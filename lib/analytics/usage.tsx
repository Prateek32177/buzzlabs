// @/lib/usage.ts

import { getUser } from '@/hooks/user-auth';
import { createClient } from '@/utils/supabase/server';
import { tierLimits } from '@/config';
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
 */
export async function trackUsage(metrics: UsageMetrics): Promise<void> {
  if (!metrics.userId) {
    console.warn('No user ID provided for usage tracking');
    return;
  }

  try {
    const supabase = await createClient();

    // Update aggregated usage counters (daily)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

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
  } catch (error) {
    console.error('Failed to track usage metrics:', error);
  }
}

export async function checkUsageLimits(userId: string): Promise<{
  hasReachedLimit: boolean;
  currentUsage: {
    requests: number;
    emails: number;
    slackNotifications: number;
    totalDataVolume: number;
    dailyLimit: {
      requests: number;
      emails: number;
      slackNotifications: number;
      dataVolumeMB: number;
    };
  };
}> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    // Get user's subscription tier
    const { subscription_tier } = await getUser();
    const tier = subscription_tier || 'free';

    // Get today's usage
    const { data: usage, error } = await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is the error code for no rows returned
      console.error('Failed to get usage data:', error);
    }

    const currentUsage = {
      requests: usage?.request_count || 0,
      emails: usage?.email_count || 0,
      slackNotifications: usage?.slack_count || 0,
      totalDataVolume: usage?.total_payload_bytes || 0,
    };

    // Define tier limits (this would come from your subscription plans table)
    const limits = tierLimits[tier] || tierLimits.free;

    // Check if any limit is exceeded
    const hasReachedLimit =
      currentUsage.requests >= limits.dailyRequests ||
      currentUsage.emails >= limits.dailyEmails ||
      currentUsage.slackNotifications >= limits.dailySlackNotifications ||
      currentUsage.totalDataVolume >= limits.dailyDataVolumeMB * 1024 * 1024;

    return {
      hasReachedLimit,
      currentUsage: {
        ...currentUsage,
        dailyLimit: {
          requests: limits.dailyRequests,
          emails: limits.dailyEmails,
          slackNotifications: limits.dailySlackNotifications,
          dataVolumeMB: limits.dailyDataVolumeMB,
        },
      },
    };
  } catch (error) {
    console.error('Failed to check usage limits:', error);
    // Default to not rate limiting on error
    return {
      hasReachedLimit: false,
      currentUsage: {
        requests: 0,
        emails: 0,
        slackNotifications: 0,
        totalDataVolume: 0,
        dailyLimit: {
          requests: 100,
          emails: 50,
          slackNotifications: 3,
          dataVolumeMB: 10,
        },
      },
    };
  }
}
