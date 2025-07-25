import { WebhookPlatformConfig } from './types';
import { WebhookPlatform } from '../types';
import { SupabaseLogo, CustomLogo, ClerkLogo } from '@/components/Logos';
import { StripeLogo } from '@/components/Logos/StripeLogo';
import { DodoLogo } from '@/components/Logos/DodoPayments';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

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
    verificationHeaders: [],
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
    verificationHeaders: [],
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
    icon: GitHubLogoIcon,
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
    verificationHeaders: [],
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
  dodopayments: {
    id: 'dodopayments',
    name: 'Dodo Payments',
    description: 'Authenticate webhooks from Dodo Payments platform',
    icon: DodoLogo,
    fields: [
      {
        key: 'signing_secret',
        label: 'Webhook Signing Secret',
        description: 'Dodo Payments signing secret (starts with whsec_)',
        type: 'secret',
        placeholder: 'whsec_...',
        required: true,
        readOnly: false,
      },
    ],
    verificationHeaders: [
      'webhook-id',
      'webhook-signature',
      'webhook-timestamp',
    ],
    docs: 'https://docs.hookflo.com/webhook-platforms/dodo',
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "webhook-id: your_webhook_id" \
  -H "webhook-signature: your_signature_here" \
  -H "webhook-timestamp: 1716112345" \
  -H "Content-Type: application/json" \
  -d '{"payment_id":"pay_12345","status":"succeeded"}'`,
    },
    showSaveButton: true,
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Use custom headers for webhook authentication',
    icon: CustomLogo,
    fields: [
      // {
      //   key: 'platform_name',
      //   label: 'Platform/App Name',
      //   description: 'Name of the platform or app you want to integrate with',
      //   type: 'text',
      //   placeholder: 'e.g. My CRM, Custom App',
      //   required: true,
      //   readOnly: false,
      // },
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
    verificationHeaders: ['x-webhook-id', 'x-webhook-token'],
    exampleCode: {
      curl: `curl -X POST https://api.SuperHook.dev/webhook \
  -H "x-webhook-id: your_webhook_id" \
  -H "x-webhook-token: your_webhook_token" \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'`,
    },
    showSaveButton: false,
  },
};
