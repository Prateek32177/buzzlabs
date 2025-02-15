import { createContext, useContext } from 'react';
import { Webhook } from './types';

type WebhookContextType = {
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
};

export const WebhookContext = createContext<WebhookContextType | undefined>(
  undefined,
);

export function useWebhook() {
  const context = useContext(WebhookContext);
  if (!context) {
    throw new Error('useWebhook must be used within WebhookProvider');
  }
  return context;
}
