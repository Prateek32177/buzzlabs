import { WebhookPlatformConfig } from './types';
import {
  Webhook,
  UserCircle,
  AlertCircle,
  CreditCard,
  Github,
} from 'lucide-react';
import { WebhookPlatform } from '../types';
import { SupabaseLogo } from '@/components/Logos';
import { ClerkLogo } from '@/components/Logos';
import StripeLogo from '@/components/Logos/StripeLogo';

export const platformConfigs: Partial<
  Record<WebhookPlatform, WebhookPlatformConfig>
> = {
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    description: 'Authenticate webhooks from Supabase DB',
    icon: SupabaseLogo,
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
        type: 'secret',
        placeholder: 'webhook secret',
        required: true,
        readOnly: true,
      },
    ],
    docs: 'https://docs.hookflo.com/webhook-platforms/supabase',
    verificationHeaders: ['x-webhook-id', 'x-webhook-token'],
    showSaveButton: false,
  },
  // custom: {
  //   id: 'custom',
  //   name: 'Custom Integration',
  //   description: 'Use custom headers for webhook authentication',
  //   icon: Webhook,
  //   fields: [
  //     {
  //       key: 'webhook_id',
  //       label: 'Webhook ID',
  //       description: 'Your unique webhook identifier',
  //       type: 'text',
  //       required: true,
  //       readOnly: false,
  //     },
  //     {
  //       key: 'webhook_token',
  //       label: 'Webhook Token',
  //       description: 'Secret token for webhook authentication',
  //       type: 'secret',
  //       required: true,
  //       readOnly: false,
  //     },
  //   ],
  //   verificationHeaders: ['x-webhook-id', 'x-webhook-token'],
  //   exampleCode: {
  //     curl: `curl -X POST https://api.SuperHook.dev/webhook \
  // -H "x-webhook-id: your_webhook_id" \
  // -H "x-webhook-token: your_webhook_token" \
  // -H "Content-Type: application/json" \
  // -d '{"event":"test"}'`,
  //   },
  //   showSaveButton: true,
  // },
  clerk: {
    id: 'clerk',
    name: 'Clerk',
    description: 'Authenticate webhooks from Clerk user management',
    icon: ClerkLogo,
    fields: [
      {
        key: 'signing_secret',
        label: 'Signing Secret',
        description: 'Clerk webhook signing secret (starts with whsec_)',
        type: 'secret',
        placeholder: 'whsec_...',
        required: true,
        readOnly: false,
      },
    ],
    verificationHeaders: ['svix-id', 'svix-timestamp', 'svix-signature'],
    docs: 'https://docs.hookflo.com/webhook-platforms/clerk',
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "svix-id: msg_..." \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: v1,..." \
  -H "Content-Type: application/json" \
  -d '{"type":"user.created"}'`,
    },
    showSaveButton: true,
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    description: 'Authenticate webhooks from Stripe payment processing',
    icon: StripeLogo,
    fields: [
      {
        key: 'signing_secret',
        label: 'Webhook Signing Secret',
        description: 'Stripe webhook signing secret (starts with whsec_)',
        type: 'secret',
        placeholder: 'whsec_...',
        required: true,
        readOnly: false,
      },
    ],
    verificationHeaders: ['stripe-signature'],
    docs: 'https://docs.hookflo.com/webhook-platforms/stripe',
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "stripe-signature: t=1234567890,v1=..." \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded"}'`,
    },
    showSaveButton: true,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    description: 'Authenticate webhooks from GitHub repositories',
    icon: Github,
    fields: [
      {
        key: 'signing_secret',
        label: 'Webhook Secret',
        description: 'GitHub webhook secret',
        type: 'secret',
        placeholder: 'your_github_webhook_secret',
        required: true,
        readOnly: false,
      },
    ],
    verificationHeaders: [
      'x-hub-signature-256',
      'x-github-event',
      'x-github-delivery',
    ],
    docs: 'https://docs.hookflo.com/webhook-platforms/github',
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "x-hub-signature-256: sha256=..." \
  -H "x-github-event: push" \
  -H "x-github-delivery: 72d3162e-cc78-11e3-81ab-4c9367dc0958" \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main","repository":{"name":"example"}}'`,
    },
    showSaveButton: true,
  },
};
