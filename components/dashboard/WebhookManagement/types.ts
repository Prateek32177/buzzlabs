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
  platformConfig: Record<string, string>;
  secret: string;
  is_active: boolean;
  notify_email: boolean;
  notify_slack: boolean;
  email_config: {
    recipient_email: string;
    template_id: string;
  } | null;
  slack_config: {
    webhook_url: string;
    channel_name: string;
    template_id: string;
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
