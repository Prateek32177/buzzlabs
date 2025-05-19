import { getUser } from '@/hooks/user-auth';
import { createClient } from '@/utils/supabase/server';
import { getUserLimits } from '@/lib/subscription/limits';

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
 * Uses a database transaction to ensure data consistency
 *
 * @param metrics UsageMetrics to be tracked
 * @param skipLimitCheck Optional boolean to skip limit checking (default: false)
 * @returns boolean indicating whether the operation was successful
 */
export async function trackUsage(
  metrics: UsageMetrics,
  skipLimitCheck: boolean = false,
): Promise<boolean> {
  if (!metrics.userId) {
    console.error('No user ID provided for usage tracking');
    return false;
  }

  if (!skipLimitCheck) {
    let actionType: 'request' | 'email' | 'slack' | 'webhook' = 'request';
    if (metrics.emailCount > 0) {
      actionType = 'email';
    } else if (metrics.slackCount > 0) {
      actionType = 'slack';
    }

    const { allowed } = await checkActionAllowed(
      metrics.userId,
      actionType,
      metrics.payloadSize,
    );

    if (!allowed) {
      console.log(
        `Usage tracking skipped: ${actionType} limit reached for user ${metrics.userId}`,
      );
      return false;
    }
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: existingUsage } = await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', metrics.userId)
      .eq('date', today)
      .single();

    if (existingUsage) {
      const { error: updateError } = await supabase
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

      if (updateError) {
        console.error('Fallback update failed:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase.from('usage_daily').insert({
        user_id: metrics.userId,
        date: today,
        request_count: metrics.requestCount,
        email_count: metrics.emailCount,
        slack_count: metrics.slackCount,
        total_payload_bytes: metrics.payloadSize,
      });

      if (insertError) {
        console.error('Fallback insert failed:', insertError);
        throw insertError;
      }
    }
    return true;
  } catch (error) {
    console.error('All usage tracking methods failed:', error);
    return false;
  }
}

/**
 * Check if the action should be permitted based on user's current usage and limits
 * @param userId The user ID to check
 * @param actionType The type of action being performed ('request', 'email', 'slack')
 * @param payloadSize The size of the payload in bytes (if applicable)
 * @returns An object with the check result and detailed usage information
 */
export async function checkActionAllowed(
  userId: string,
  actionType: 'request' | 'email' | 'slack' | 'webhook',
  payloadSize: number = 0,
  actionCount?: number,
): Promise<{
  allowed: boolean;
  reason?: string;
  usageDetails: {
    current: number;
    limit: number;
    percentUsed: number;
  };
}> {
  try {
    const { hasReachedLimit, limitInfo } = await checkUsageLimits(
      userId,
      actionCount,
    );
    if (hasReachedLimit) {
      if (actionType === 'request' && limitInfo.requests.exceeded) {
        return {
          allowed: false,
          reason: `Daily request limit reached (${limitInfo.requests.current}/${limitInfo.requests.limit})`,
          usageDetails: {
            current: limitInfo.requests.current,
            limit: limitInfo.requests.limit,
            percentUsed:
              (limitInfo.requests.current / limitInfo.requests.limit) * 100,
          },
        };
      }

      if (actionType === 'email') {
        if (limitInfo.dailyEmails.exceeded) {
          return {
            allowed: false,
            reason: `Daily email limit reached (${limitInfo.dailyEmails.current}/${limitInfo.dailyEmails.limit})`,
            usageDetails: {
              current: limitInfo.dailyEmails.current,
              limit: limitInfo.dailyEmails.limit,
              percentUsed:
                (limitInfo.dailyEmails.current / limitInfo.dailyEmails.limit) *
                100,
            },
          };
        }

        if (limitInfo.monthlyEmails.exceeded) {
          return {
            allowed: false,
            reason: `Monthly email limit reached (${limitInfo.monthlyEmails.current}/${limitInfo.monthlyEmails.limit})`,
            usageDetails: {
              current: limitInfo.monthlyEmails.current,
              limit: limitInfo.monthlyEmails.limit,
              percentUsed:
                (limitInfo.monthlyEmails.current /
                  limitInfo.monthlyEmails.limit) *
                100,
            },
          };
        }
      }

      if (actionType === 'slack') {
        if (limitInfo.dailySlackNotifications.exceeded) {
          return {
            allowed: false,
            reason: `Daily Slack notification limit reached (${limitInfo.dailySlackNotifications.current}/${limitInfo.dailySlackNotifications.limit})`,
            usageDetails: {
              current: limitInfo.dailySlackNotifications.current,
              limit: limitInfo.dailySlackNotifications.limit,
              percentUsed:
                (limitInfo.dailySlackNotifications.current /
                  limitInfo.dailySlackNotifications.limit) *
                100,
            },
          };
        }

        if (limitInfo.monthlySlackNotifications.exceeded) {
          return {
            allowed: false,
            reason: `Monthly Slack notification limit reached (${limitInfo.monthlySlackNotifications.current}/${limitInfo.monthlySlackNotifications.limit})`,
            usageDetails: {
              current: limitInfo.monthlySlackNotifications.current,
              limit: limitInfo.monthlySlackNotifications.limit,
              percentUsed:
                (limitInfo.monthlySlackNotifications.current /
                  limitInfo.monthlySlackNotifications.limit) *
                100,
            },
          };
        }
      }

      if (payloadSize > 0 && limitInfo.dataVolume.exceeded) {
        return {
          allowed: false,
          reason: `Daily data volume limit reached (${(limitInfo.dataVolume.current / (1024 * 1024)).toFixed(2)}MB/${limitInfo.dataVolume.limitMB}MB)`,
          usageDetails: {
            current: Math.round(limitInfo.dataVolume.current / (1024 * 1024)),
            limit: limitInfo.dataVolume.limitMB,
            percentUsed:
              (limitInfo.dataVolume.current /
                (limitInfo.dataVolume.limitMB * 1024 * 1024)) *
              100,
          },
        };
      }

      if (actionType === 'webhook') {
        if (limitInfo.webhooks.exceeded) {
          return {
            allowed: false,
            reason: `Webhook limit reached (${limitInfo.webhooks.current}/${limitInfo.webhooks.limit})`,
            usageDetails: {
              current: limitInfo.webhooks.current,
              limit: limitInfo.webhooks.limit,
              percentUsed:
                (limitInfo.webhooks.current / limitInfo.webhooks.limit) * 100,
            },
          };
        }
      }
    }

    let usageDetails;

    switch (actionType) {
      case 'request':
        usageDetails = {
          current: limitInfo.requests.current,
          limit: limitInfo.requests.limit,
          percentUsed:
            (limitInfo.requests.current / limitInfo.requests.limit) * 100,
        };
        break;
      case 'email':
        usageDetails = {
          current: limitInfo.monthlyEmails.current,
          limit: limitInfo.monthlyEmails.limit,
          percentUsed:
            (limitInfo.monthlyEmails.current / limitInfo.monthlyEmails.limit) *
            100,
        };
        break;
      case 'slack':
        usageDetails = {
          current: limitInfo.monthlySlackNotifications.current,
          limit: limitInfo.monthlySlackNotifications.limit,
          percentUsed:
            (limitInfo.monthlySlackNotifications.current /
              limitInfo.monthlySlackNotifications.limit) *
            100,
        };
        break;
      case 'webhook':
        usageDetails = {
          current: limitInfo.webhooks.current,
          limit: limitInfo.webhooks.limit,
          percentUsed:
            (limitInfo.webhooks.current / limitInfo.webhooks.limit) * 100,
        };
        break;
      default:
        usageDetails = {
          current: 0,
          limit: 0,
          percentUsed: 0,
        };
    }

    return {
      allowed: true,
      usageDetails,
    };
  } catch (error) {
    console.error('Failed to check if action is allowed:', error);
    return {
      allowed: true,
      reason: 'Error checking limits. Action allowed as a failsafe.',
      usageDetails: {
        current: 0,
        limit: 0,
        percentUsed: 0,
      },
    };
  }
}

export async function checkUsageLimits(
  userId: string,
  actionCount?: number,
): Promise<{
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const user = await getUser();
    const tier = user?.subscription_tier || 'free';

    const limits = await getUserLimits(userId, tier);

    const { data: todayUsageData, error: todayUsageError } = await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (todayUsageError && todayUsageError.code !== 'PGRST116') {
      console.error('Error fetching today usage:', todayUsageError);
    }

    const todayUsage = todayUsageData || {
      request_count: 0,
      email_count: 0,
      slack_count: 0,
      total_payload_bytes: 0,
    };

    const { count: activeWebhooks, error: webhookError } = await supabase
      .from('webhooks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (webhookError) {
      console.error('Error counting webhooks:', webhookError);
    }

    const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
    const { data: monthUsage, error: monthUsageError } = await supabase
      .from('usage_daily')
      .select('email_count, slack_count')
      .eq('user_id', userId)
      .gte('date', startOfMonth)
      .lte('date', today);

    if (monthUsageError) {
      console.error('Error fetching month usage:', monthUsageError);
    }

    let monthlyEmailCount = 0;
    let monthlySlackCount = 0;

    if (monthUsage && monthUsage.length > 0) {
      monthUsage.forEach(day => {
        monthlyEmailCount += day.email_count || 0;
        monthlySlackCount += day.slack_count || 0;
      });
    }

    const currentUsage = {
      requests: todayUsage.request_count || 0,
      dailyEmails: todayUsage.email_count || 0,
      dailySlackNotifications: todayUsage.slack_count || 0,
      totalDataVolume: todayUsage.total_payload_bytes || 0,
      webhooks: activeWebhooks || 0,
      monthlyEmailCount,
      monthlySlackCount,
    };

    const limitInfo = {
      requests: {
        current: currentUsage.requests,
        limit: limits.dailyRequests,
        exceeded: currentUsage.requests >= limits.dailyRequests,
      },
      dailyEmails: {
        current: currentUsage.dailyEmails,
        limit: limits.dailyEmails,
        exceeded: currentUsage.dailyEmails + actionCount > limits.dailyEmails,
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
          currentUsage.monthlyEmailCount + (actionCount || 1) >
          limits.emailNotificationLimit,
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
    return {
      hasReachedLimit: false,
      limitInfo: {
        requests: { current: 0, limit: 100, exceeded: false },
        dailyEmails: { current: 0, limit: 10, exceeded: false },
        dailySlackNotifications: { current: 0, limit: 50, exceeded: false },
        dataVolume: { current: 0, limitMB: 10, exceeded: false },
        webhooks: { current: 0, limit: 5, exceeded: false },
        monthlyEmails: { current: 0, limit: 100, exceeded: false },
        monthlySlackNotifications: { current: 0, limit: 300, exceeded: false },
      },
    };
  }
}
