import { WebhookPlatformConfig } from './types';
import { Webhook, UserCircle, AlertCircle } from 'lucide-react';
import { WebhookPlatform } from '../types';

export const platformConfigs: Record<WebhookPlatform, WebhookPlatformConfig> = {
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    description: 'Authenticate webhooks from Supabase DB',
    icon: AlertCircle,
    fields: [
      {
        key: 'webhook_id',
        label: 'x-webhook-id',
        description: 'Set x-webhook-id in header',
        type: 'text',
        placeholder: 'webhook id',
        required: true,
        readOnly: true,
      },
      {
        key: 'webhook_token',
        label: 'x-webhook-token',
        description: 'Set x-webhook-token in header',
        type: 'text',
        placeholder: 'webhook secret',
        required: true,
        readOnly: true,
      },
    ],
    verificationHeaders: ['x-webhook-id', 'x-webhook-token'],
  },
  custom: {
    id: 'custom',
    name: 'Custom Integration',
    description: 'Use custom headers for webhook authentication',
    icon: Webhook,
    fields: [
      {
        key: 'webhook_id',
        label: 'Webhook ID',
        description: 'Your unique webhook identifier',
        type: 'text',
        required: true,
        readOnly: true,
      },
      {
        key: 'webhook_token',
        label: 'Webhook Token',
        description: 'Secret token for webhook authentication',
        type: 'secret',
        required: true,
        readOnly: true,
      },
    ],
    verificationHeaders: ['x-webhook-id', 'x-webhook-token'],
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "x-webhook-id: your_webhook_id" \
  -H "x-webhook-token: your_webhook_token" \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'`,
    },
  },
  clerk: {
    id: 'clerk',
    name: 'Clerk',
    description: 'Authenticate webhooks from Clerk user management',
    icon: UserCircle,
    fields: [
      {
        key: 'signing_secret',
        label: 'Signing Secret',
        description: 'Clerk webhook signing secret (starts with whsec_)',
        type: 'secret',
        placeholder: 'whsec_...',
        required: true,
        readOnly: true,
      },
    ],
    verificationHeaders: ['svix-id', 'svix-timestamp', 'svix-signature'],
    docs: 'https://clerk.com/docs/integration/webhooks',
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "svix-id: msg_..." \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: v1,..." \
  -H "Content-Type: application/json" \
  -d '{"type":"user.created"}'`,
    },
  },
};
