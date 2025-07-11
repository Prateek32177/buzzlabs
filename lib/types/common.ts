export interface NotificationLogType {
  id: string;
  webhook_id: string | null;
  platform: string;
  status: string;
  payload: any;
  email_sent: boolean | null;
  email_recipient: string | null;
  slack_sent: boolean | null;
  slack_channel: string | null;
  error_message: string | null;
  processed_at: string;
  channel: string | null;
  webhook_name: string | null;
  user_id: string | null;
  queuedAt: bigint | null;
  embedding?: number[];
  searchable_text?: string;
  embedding_generated?: boolean;
}

export interface WebhookType {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
  notify_email: boolean;
  notify_slack: boolean;
  email_config: any;
  slack_config: any;
  user_id: string;
  created_at: string;
  updated_at: string;
  platformConfig: any;
}
