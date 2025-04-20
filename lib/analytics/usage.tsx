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

export async function trackUsage(metrics: UsageMetrics) {
  try {
    const apiUrl = `${process.env.PROD_URL}/api/usage/track`;
    const internalApiSecret = process.env.INTERNAL_API_SECRET;

    if (!internalApiSecret) {
      return { success: false, error: 'Missing API configuration' };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${internalApiSecret}`,
      },
      body: JSON.stringify(metrics),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Usage tracking API error:', errorData);
      return { success: false, error: errorData };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to track usage:', error);
    return { success: false, error };
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
