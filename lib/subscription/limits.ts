// @/lib/subscription/limits.ts

import { createClient } from '@/utils/supabase/server';

export interface TierLimits {
  dailyRequests: number;
  dailyEmails: number;
  dailySlackNotifications: number;
  dailyDataVolumeMB: number;
  webhookLimit: number;
  emailNotificationLimit: number; // Monthly email notification limit
  slackNotificationLimit: number; // Monthly slack notification limit
}

const DEFAULT_LIMITS: TierLimits = {
  dailyRequests: 100,
  dailyEmails: 20,
  dailySlackNotifications: 100,
  dailyDataVolumeMB: 10,
  webhookLimit: 5,
  emailNotificationLimit: 100, // Monthly limit
  slackNotificationLimit: 100, // Monthly limit
};

/**
 * Get subscription limits for a user based on their tier
 * Checks for user-specific overrides first, then tier limits, then falls back to defaults
 *
 * @param userId - The user's ID to check for overrides
 * @param tier - The subscription tier name (defaults to 'free')
 * @returns Promise resolving to the user's limits
 */
export async function getUserLimits(
  userId: string,
  tier: string = 'free',
): Promise<TierLimits> {
  try {
    const supabase = await createClient();

    // First check for user-specific overrides
    if (userId) {
      const { data: userOverrides } = await supabase
        .from('user_subscription_overrides')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userOverrides) {
        // Return user-specific overrides, falling back to defaults for any undefined values
        return {
          dailyRequests:
            userOverrides.daily_requests ?? DEFAULT_LIMITS.dailyRequests,
          dailyEmails: userOverrides.daily_emails ?? DEFAULT_LIMITS.dailyEmails,
          dailySlackNotifications:
            userOverrides.daily_slack_notifications ??
            DEFAULT_LIMITS.dailySlackNotifications,
          dailyDataVolumeMB:
            userOverrides.daily_data_volume_mb ??
            DEFAULT_LIMITS.dailyDataVolumeMB,
          webhookLimit:
            userOverrides.webhook_limit ?? DEFAULT_LIMITS.webhookLimit,
          emailNotificationLimit:
            userOverrides.email_notification_limit ??
            DEFAULT_LIMITS.emailNotificationLimit,
          slackNotificationLimit:
            userOverrides.slack_notification_limit ??
            DEFAULT_LIMITS.slackNotificationLimit,
        };
      }
    }

    // Otherwise, fetch tier limits from the database
    const { data: tierData } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('name', tier)
      .single();

    if (tierData) {
      return {
        dailyRequests: tierData.daily_requests,
        dailyEmails: tierData.daily_emails,
        dailySlackNotifications: tierData.daily_slack_notifications,
        dailyDataVolumeMB: tierData.daily_data_volume_mb,
        webhookLimit: tierData.webhook_limit,
        emailNotificationLimit: tierData.email_notification_limit,
        slackNotificationLimit: tierData.slack_notification_limit,
      };
    }

    // Fallback to default limits if tier not found
    return DEFAULT_LIMITS;
  } catch (error) {
    console.error('Failed to fetch subscription limits:', error);
    return DEFAULT_LIMITS;
  }
}
