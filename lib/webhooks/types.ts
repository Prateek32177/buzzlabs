export type WebhookPlatform = 'custom' | 'clerk';

export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
  platform?: WebhookPlatform;
  payload?: any;
  metadata?: {
    timestamp?: string;
    id?: string;
    [key: string]: any;
  };
}

export interface WebhookConfig {
  platform: WebhookPlatform;
  secret: string;
  toleranceInSeconds?: number;
}
