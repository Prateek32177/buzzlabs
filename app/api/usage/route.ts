// /api/usage/route.ts
import { getUser } from '@/hooks/user-auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getUserLimits, TierLimits } from '@/lib/subscription/limits';
import { checkUsageLimits } from '@/lib/analytics/usage';

interface UsageRow {
  date: string;
  user_id: string;
  request_count: number;
  email_count: number;
  slack_count: number;
  total_payload_bytes: number;
}

interface CurrentUsage {
  requests: { current: number; limit: number; percentage: number };
  dailyEmails: { current: number; limit: number; percentage: number };
  dailySlackNotifications: {
    current: number;
    limit: number;
    percentage: number;
  };
  dataVolume: { current: number; limitMB: number; percentage: number };
  webhooks: { current: number; limit: number; percentage: number };
  monthlyEmails: { current: number; limit: number; percentage: number };
  monthlySlackNotifications: {
    current: number;
    limit: number;
    percentage: number;
  };
  totalNotifications: number; // For backwards compatibility
}

interface UserType {
  userId: string;
  subscription_tier?: string;
}

// Helper functions - preserved from original implementation

/**
 * Process historical data for email and slack notifications
 * Returns data formatted for charts
 */
function processEmailSlackData(historicalData: UsageRow[]) {
  if (!historicalData || historicalData.length === 0) return [];

  const dateMap = new Map<
    string,
    { date: string; Email: number; Slack: number }
  >();

  historicalData.forEach(day => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    dateMap.set(formattedDate, {
      date: formattedDate,
      Email: day.email_count || 0,
      Slack: day.slack_count || 0,
    });
  });

  return Array.from(dateMap.values());
}

/**
 * Process webhook data by month
 * Returns monthly aggregated webhook request data
 */
function processWebhookData(historicalData: UsageRow[]) {
  if (!historicalData || historicalData.length === 0) return [];

  const monthMap = new Map<string, number>();

  historicalData.forEach(day => {
    const date = new Date(day.date);
    const month = date.toLocaleDateString('en-US', { month: 'short' });

    const current = monthMap.get(month) || 0;
    monthMap.set(month, current + (day.request_count || 0));
  });

  const monthlyData: { name: string; value: number }[] = [];

  for (const [name, value] of monthMap.entries()) {
    monthlyData.push({ name, value });
  }

  return monthlyData;
}

/**
 * Calculate total notifications (email + slack) for current month
 */
function calculateTotalNotifications(historicalData: UsageRow[]) {
  if (!historicalData) return 0;

  const currentMonth = new Date().getMonth();
  let total = 0;

  historicalData.forEach(day => {
    const date = new Date(day.date);
    if (date.getMonth() === currentMonth) {
      total += (day.email_count || 0) + (day.slack_count || 0);
    }
  });

  return total;
}

export async function GET() {
  try {
    const user = (await getUser()) as UserType | null;
    if (!user || !user?.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const userId = user.userId;
    const supabase = await createClient();

    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const subscription_tier = user.subscription_tier || 'free';

    // Get user's limits based on their subscription tier
    const limits = await getUserLimits(userId, subscription_tier);

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

    // Get month-to-date usage for current month (detailed)
    const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
    const { data: monthUsage } = await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startOfMonth)
      .lte('date', today);

    // Calculate month-to-date totals
    let monthlyEmailCount = 0;
    let monthlySlackCount = 0;

    if (monthUsage && monthUsage.length > 0) {
      monthUsage.forEach(day => {
        monthlyEmailCount += day.email_count || 0;
        monthlySlackCount += day.slack_count || 0;
      });
    }

    // Calculate total notifications for the current month (for backwards compatibility)
    const totalNotifications = calculateTotalNotifications(monthUsage || []);

    // Calculate current usage percentages
    const todayRequestCount = todayUsage?.request_count || 0;
    const todayEmailCount = todayUsage?.email_count || 0;
    const todaySlackCount = todayUsage?.slack_count || 0;
    const todayDataVolume = todayUsage?.total_payload_bytes || 0;

    const currentUsage: CurrentUsage = {
      requests: {
        current: todayRequestCount,
        limit: limits.dailyRequests,
        percentage: Math.min(
          100,
          Math.round((todayRequestCount / limits.dailyRequests) * 100),
        ),
      },
      dailyEmails: {
        current: todayEmailCount,
        limit: limits.dailyEmails,
        percentage: Math.min(
          100,
          Math.round((todayEmailCount / limits.dailyEmails) * 100),
        ),
      },
      dailySlackNotifications: {
        current: todaySlackCount,
        limit: limits.dailySlackNotifications,
        percentage: Math.min(
          100,
          Math.round((todaySlackCount / limits.dailySlackNotifications) * 100),
        ),
      },
      dataVolume: {
        current: todayDataVolume,
        limitMB: limits.dailyDataVolumeMB,
        percentage: Math.min(
          100,
          Math.round(
            (todayDataVolume / (limits.dailyDataVolumeMB * 1024 * 1024)) * 100,
          ),
        ),
      },
      webhooks: {
        current: activeWebhooks || 0,
        limit: limits.webhookLimit,
        percentage: Math.min(
          100,
          Math.round(((activeWebhooks || 0) / limits.webhookLimit) * 100),
        ),
      },
      monthlyEmails: {
        current: monthlyEmailCount,
        limit: limits.emailNotificationLimit,
        percentage: Math.min(
          100,
          Math.round((monthlyEmailCount / limits.emailNotificationLimit) * 100),
        ),
      },
      monthlySlackNotifications: {
        current: monthlySlackCount,
        limit: limits.slackNotificationLimit,
        percentage: Math.min(
          100,
          Math.round((monthlySlackCount / limits.slackNotificationLimit) * 100),
        ),
      },
      totalNotifications: totalNotifications, // For backwards compatibility
    };

    // Check if user has exceeded any limits
    const { hasReachedLimit, limitInfo } = await checkUsageLimits(userId);

    // Get usage history (last 30 days for charts)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: usageHistory } = await supabase
      .from('usage_daily')
      .select(
        'date, user_id, request_count, email_count, slack_count, total_payload_bytes',
      )
      .eq('user_id', userId)
      .gte('date', formattedDate)
      .order('date', { ascending: true });

    // Process data for charts (using helper functions)
    const emailSlackChartData = processEmailSlackData(usageHistory || []);
    const webhookChartData = processWebhookData(usageHistory || []);

    // Get recent usage (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoFormatted = sevenDaysAgo.toISOString().split('T')[0];

    const { data: recentUsage } = await supabase
      .from('usage_daily')
      .select(
        'date, request_count, email_count, slack_count, total_payload_bytes',
      )
      .eq('user_id', userId)
      .gte('date', sevenDaysAgoFormatted)
      .order('date', { ascending: false });

    return NextResponse.json({
      currentUsage,
      hasReachedLimit,
      limitInfo,
      usageHistory: recentUsage || [],
      chartData: {
        emailSlack: emailSlackChartData,
        webhooks: webhookChartData,
      },
      totalNotifications,
      subscription: {
        tier: subscription_tier,
        limits,
      },
    });
  } catch (error) {
    console.error('Failed to fetch usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 },
    );
  }
}
