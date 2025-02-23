export type WebhookAuthType = 'token' | 'custom' | 'hmac';

export interface WebhookAuth {
  type: WebhookAuthType;
  token?: string; // For pre-generated token
  headerName?: string; // For custom header
  secret?: string; // For custom secret or HMAC
}

export type WebhookPlatform = 'custom' | 'clerk';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  platform: WebhookPlatform;
  platformConfig: Record<string, string>;
  secret: string;
  isActive: boolean;
  notifyEmail: boolean;
  notifySlack: boolean;
  emailConfig: {
    recipientEmail: string;
    templateId: string;
  } | null;
  slackConfig: {
    webhookUrl: string;
    channelName: string;
    templateId: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookContextType {
  webhooks: Webhook[];
  isLoading: boolean;
  isLoadingId: string | null;
  showEmailConfig: string | null;
  showSlackConfig: string | null;
  showDetails: string | null;
  setShowEmailConfig: (id: string | null) => void;
  setShowSlackConfig: (id: string | null) => void;
  setShowDetails: (id: string | null) => void;
  toggleWebhook: (
    id: string,
    field: 'isActive' | 'notifyEmail' | 'notifySlack',
  ) => Promise<void>;
  updateWebhookConfig: (id: string, config: Partial<Webhook>) => Promise<void>;
}
