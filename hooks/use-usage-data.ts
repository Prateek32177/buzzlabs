import { useState, useEffect } from 'react';

export interface UsageData {
  subscription: {
    tier: string;
    limits: {
      dailyRequests: number;
      dailyEmails: number;
      dailySlackNotifications: number;
      dailyDataVolumeMB: number;
      webhookLimit: number;
      notificationLimit: number;
    };
  };
  usage: {
    current: {
      requests: number;
      emails: number;
      slackNotifications: number;
      totalDataVolume: number;
      activeWebhooks: number;
      totalNotifications: number;
    };
    emailSlackData: Array<{
      date: string;
      Email: number;
      Slack: number;
    }>;
    webhookData: Array<{
      name: string;
      value: number;
    }>;
  };
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
    const newLimitStatus = {
      requests:
        data.usage.current.requests >= data.subscription.limits.dailyRequests,
      emails: data.usage.current.emails >= data.subscription.limits.dailyEmails,
      slack:
        data.usage.current.slackNotifications >=
        data.subscription.limits.dailySlackNotifications,
      webhooks:
        data.usage.current.activeWebhooks >=
        data.subscription.limits.webhookLimit,
      notifications:
        data.usage.current.totalNotifications >=
        data.subscription.limits.notificationLimit,
    };
    setLimitStatus(newLimitStatus);
  };

  useEffect(() => {
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

    fetchUsageData();
    const interval = setInterval(fetchUsageData, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
  };
}
