import { useState, useEffect } from 'react';

interface UsageMetric {
  current: number;
  limit: number;
  percentage: number;
}

interface UsageData {
  subscription: {
    tier: string;
    limits: {
      dailyRequests: number;
      dailyEmails: number;
      dailySlackNotifications: number;
      dailyDataVolumeMB: number;
      webhookLimit: number;
      emailNotificationLimit: number;
      slackNotificationLimit: number;
    };
  };
  currentUsage: {
    requests: UsageMetric;
    dailyEmails: UsageMetric;
    dailySlackNotifications: UsageMetric;
    dataVolume: { current: number; limitMB: number; percentage: number };
    webhooks: UsageMetric;
    monthlyEmails: UsageMetric;
    monthlySlackNotifications: UsageMetric;
    totalNotifications: number;
  };
  chartData: {
    emailSlack: Array<{ date: string; Email: number; Slack: number }>;
    webhooks: Array<{ name: string; value: number }>;
  };
  hasReachedLimit: boolean;
  limitInfo: any;
}

interface LimitStatus {
  requests: boolean;
  emails: boolean;
  slack: boolean;
  webhooks: boolean;
  notifications: boolean;
}

export function useUsageData() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limitStatus, setLimitStatus] = useState<LimitStatus>({
    requests: false,
    emails: false,
    slack: false,
    webhooks: false,
    notifications: false,
  });

  const checkLimits = (data: UsageData) => {
    const usage = data.currentUsage;
    const newLimitStatus = {
      requests: usage.requests.current >= usage.requests.limit,
      emails: usage.dailyEmails.current >= usage.dailyEmails.limit,
      slack:
        usage.dailySlackNotifications.current >=
        usage.dailySlackNotifications.limit,
      webhooks: usage.webhooks.current >= usage.webhooks.limit,
      notifications:
        usage.totalNotifications >=
        data.subscription.limits.emailNotificationLimit +
          data.subscription.limits.slackNotificationLimit,
    };
    setLimitStatus(newLimitStatus);
  };

  const fetchUsageData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/usage');

      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }

      const data = await response.json();
      setUsageData(data);
      checkLimits(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  const getLimitMessages = () => {
    const limitTypes: string[] = [];
    if (limitStatus.requests) limitTypes.push('requests');
    if (limitStatus.emails) limitTypes.push('emails');
    if (limitStatus.slack) limitTypes.push('Slack notifications');
    if (limitStatus.webhooks) limitTypes.push('webhooks');
    if (limitStatus.notifications) limitTypes.push('notifications');

    if (limitTypes.length === 0) return '';
    if (limitTypes.length === 1) return `Daily ${limitTypes[0]} limit reached`;

    const lastType = limitTypes.pop();
    return `Daily limits reached for ${limitTypes.join(', ')} and ${lastType}`;
  };

  const hasReachedAnyLimit = Object.values(limitStatus).some(status => status);

  return {
    usageData,
    isLoading,
    error,
    limitStatus,
    limitMessages: getLimitMessages(),
    hasReachedAnyLimit,
    refetch: fetchUsageData
  };
}
