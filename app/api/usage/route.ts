import { getUser } from '@/hooks/user-auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { tierLimits } from '@/config';

interface UsageRow {
  date: string;
  user_id: string;
  request_count: number;
  email_count: number;
  slack_count: number;
  total_payload_bytes: number;
}

interface Limits {
  dailyRequests: number;
  dailyEmails: number;
  dailySlackNotifications: number;
  dailyDataVolumeMB: number;
  webhookLimit: number;
  notificationLimit: number;
}

interface CurrentUsage {
  requests: number;
  emails: number;
  slackNotifications: number;
  totalDataVolume: number;
  activeWebhooks: number;
  totalNotifications: number;
}

interface UserType {
  userId: string;
  subscription_tier?: string;
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
    const subscription_tier = user.subscription_tier || 'free';

    const limits = tierLimits[subscription_tier] || tierLimits.free;

    const { data: todayUsage } = await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single<UsageRow>();

    const { count: activeWebhooks } = await supabase
      .from('webhooks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: historicalData = [] } = (await supabase
      .from('usage_daily')
      .select('*')
      .eq('user_id', userId)
      .gte('date', fromDate)
      .order('date', { ascending: true })) as { data: UsageRow[] };

    const emailSlackData = processEmailSlackData(historicalData);
    const webhookData = processWebhookData(historicalData);

    const currentUsage: CurrentUsage = {
      requests: todayUsage?.request_count || 0,
      emails: todayUsage?.email_count || 0,
      slackNotifications: todayUsage?.slack_count || 0,
      totalDataVolume: todayUsage?.total_payload_bytes || 0,
      activeWebhooks: activeWebhooks || 0,
      totalNotifications: calculateTotalNotifications(historicalData),
    };

    const hasReachedLimit = checkLimits(currentUsage, limits);

    return NextResponse.json({
      subscription: {
        tier: subscription_tier,
        limits,
      },
      usage: {
        current: currentUsage,
        hasReachedLimit,
        emailSlackData,
        webhookData,
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

// Helper functions

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

function checkLimits(usage: CurrentUsage, limits: Limits) {
  return (
    usage.requests >= limits.dailyRequests ||
    usage.emails >= limits.dailyEmails ||
    usage.slackNotifications >= limits.dailySlackNotifications ||
    usage.totalDataVolume >= limits.dailyDataVolumeMB * 1024 * 1024 ||
    usage.activeWebhooks >= limits.webhookLimit ||
    usage.totalNotifications >= limits.notificationLimit
  );
}
