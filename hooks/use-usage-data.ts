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
    hasReachedLimit: boolean;
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

export function useUsageData() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
      } catch (err) {
        console.error('Error fetching usage data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();

    // Set up a polling interval to refresh data
    const interval = setInterval(fetchUsageData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return { usageData, isLoading, error };
}
