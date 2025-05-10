export interface UsageMetric {
  current: number;
  limit: number;
  percentage: number;
}

export interface DataVolumeMetric {
  current: number;
  limitMB: number;
  percentage: number;
}

export interface ChartPoint {
  date: string;
  Email: number;
  Slack: number;
}

export interface WebhookChartPoint {
  name: string; // e.g., "Apr", "May"
  value: number;
}

export interface SubscriptionLimits {
  dailyRequests: number;
  dailyEmails: number;
  dailySlackNotifications: number;
  dailyDataVolumeMB: number;
  webhookLimit: number;
  emailNotificationLimit: number;
  slackNotificationLimit: number;
}

export interface SubscriptionData {
  tier: string;
  limits: SubscriptionLimits;
}

export interface CurrentUsage {
  requests: UsageMetric;
  dailyEmails: UsageMetric;
  dailySlackNotifications: UsageMetric;
  dataVolume: DataVolumeMetric;
  webhooks: UsageMetric;
  monthlyEmails: UsageMetric;
  monthlySlackNotifications: UsageMetric;
  totalNotifications: number; // for backwards compatibility
}

export interface UsageAPIResponse {
  currentUsage: CurrentUsage;
  hasReachedLimit: boolean;
  limitInfo: any; // Can be refined if the shape of this object is known
  usageHistory: Array<{
    date: string;
    request_count: number;
    email_count: number;
    slack_count: number;
    total_payload_bytes: number;
  }>;
  chartData: {
    emailSlack: ChartPoint[];
    webhooks: WebhookChartPoint[];
  };
  totalNotifications: number;
  subscription: SubscriptionData;
}
