'use client';

import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';
import { Webhook } from '@/components/dashboard/WebhookManagement/types';
import { WebhookPlatform } from '@/lib/webhooks/types';
import { platformConfigs } from '@/lib/webhooks/platforms/configs';
import { useClipboard } from '@/components/dashboard/WebhookManagement/useClipboard';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Check,
  Clipboard,
  Mail,
  Slack,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { EmailTemplateOptions } from '@/const';
import { SlackTemplateOptions } from '@/const';
import { emailTemplates } from '@/lib/templates';
import { randomSlackChannelName } from '@/lib/utils';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const webhookId = id;
  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<WebhookPlatform>('supabase');
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [showSlackConfig, setShowSlackConfig] = useState(false);
  const { copyToClipboard } = useClipboard();
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (webhookId) {
      fetchWebhook();
    }
  }, [webhookId]);

  // This effect initializes the platform and configValues when webhook data is loaded
  useEffect(() => {
    if (webhook?.platformConfig) {
      try {
        const platformConfig =
          typeof webhook.platformConfig === 'string'
            ? JSON.parse(webhook.platformConfig)
            : webhook.platformConfig || {};

        setConfigValues(prevValues => ({
          ...prevValues,
          ...platformConfig,
        }));

        const availablePlatforms = Object.keys(platformConfig);
        if (availablePlatforms.length > 0 && !platform) {
          setPlatform(availablePlatforms[0] as WebhookPlatform);
        }
      } catch (error) {
        console.error('Error parsing platform config:', error);
      }
    }
  }, [webhook]);

  const fetchWebhook = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/webhooks/${webhookId}`);
      if (!response.ok) throw new Error('Failed to fetch webhook');
      const data = await response.json();
      setWebhook(data);
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to fetch webhook',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateWebhookConfig = async (id: string, config: Partial<Webhook>) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update webhook');
      }

      const updatedWebhook = await response.json();

      setWebhook(prev => {
        if (!prev || prev.id !== id) return prev;
        return { ...prev, ...updatedWebhook };
      });

      if (config.platformConfig) {
        const newPlatformConfig =
          typeof config.platformConfig === 'string'
            ? JSON.parse(config.platformConfig)
            : config.platformConfig;

        setConfigValues(prev => ({
          ...prev,
          ...newPlatformConfig,
        }));
      }

      toast.success('Success', {
        description: 'Webhook configuration updated',
      });

      return updatedWebhook;
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to update webhook',
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlatformChange = (newPlatform: WebhookPlatform) => {
    setPlatform(newPlatform);
  };

  const handleNameUpdate = async () => {
    if (!webhook) return;

    try {
      await updateWebhookConfig(webhook.id, { name: webhook.name });
      toast.success('Webhook name updated successfully');
    } catch (error) {
      toast.error('Error', { description: 'Failed to update webhook name' });
    }
  };

  const handleConfigUpdate = async () => {
    try {
      const currentValues = (configValues[platform] || {}) as Record<
        string,
        any
      >;
      const missingFields = currentConfig!.fields
        .filter(field => field.required && !currentValues[field.key])
        .map(field => field.label);

      if (missingFields.length > 0) {
        toast.error('Error', {
          description: `Missing required fields: ${missingFields.join(', ')}`,
        });
        return;
      }

      const updatedConfigValues = {
        ...configValues,
        [platform]: currentValues,
      };

      const updatedConfig = {
        platformConfig: updatedConfigValues,
      };

      if (webhook?.id) {
        await updateWebhookConfig(webhook.id, updatedConfig);
      }

      toast.success('Configuration updated successfully');
    } catch (error) {
      toast.error('Error', { description: 'Failed to update configuration' });
    }
  };

  const handleNotificationToggle = async (
    field: 'notify_email' | 'notify_slack',
  ) => {
    if (!webhook) return;

    const isCurrentlyEnabled =
      field === 'notify_email' ? webhook.notify_email : webhook.notify_slack;

    if (isCurrentlyEnabled) {
      await updateWebhookConfig(webhook.id, {
        [field]: !isCurrentlyEnabled,
      });
    } else {
      if (field === 'notify_email') {
        setShowEmailConfig(true);
      } else {
        setShowSlackConfig(true);
      }
    }
  };

  // Determine whether to show loading state
  const isPageLoading = isLoading && !webhook;

  if (isPageLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader text='Loading webhook details...' />
      </div>
    );
  }

  const currentValues = configValues[platform] || {};
  const currentConfig = platformConfigs[platform];

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Webhook Details</h1>
        <p className='text-zinc-400'>
          Configure your webhook settings and notifications
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='grid gap-6 py-4 bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between flex-wrap'>
              <h3 className='text-base font-medium'>Webhook Details</h3>
              <div className='flex items-center gap-2'>
                <Badge variant={webhook.is_active ? 'default' : 'destructive'}>
                  {webhook.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Switch
                  checked={webhook.is_active}
                  onCheckedChange={async checked => {
                    try {
                      await updateWebhookConfig(webhook.id, {
                        is_active: checked,
                      });
                      toast.success('Webhook status updated successfully');
                    } catch (error) {
                      toast.error('Error', {
                        description: 'Failed to update webhook status',
                      });
                    }
                  }}
                  disabled={isLoading || isSaving}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label>Name</Label>
              <div className='flex gap-2'>
                <Input
                  value={webhook.name}
                  onChange={e =>
                    setWebhook({ ...webhook, name: e.target.value })
                  }
                  placeholder='Webhook name'
                  className='text-sm'
                />
                <Button
                  onClick={handleNameUpdate}
                  disabled={isLoading || isSaving}
                >
                  {isLoading || isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <h3 className='text-base font-medium text-white mb-4'>
              Select an Application to integrate with
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {Object.values(platformConfigs).map(config => (
                <div
                  key={config.id}
                  onClick={() => handlePlatformChange(config.id)}
                  className={`cursor-pointer p-4 rounded-lg border ${
                    platform === config.id
                      ? 'bg-emerald-600/20 border-emerald-500 shadow-sm'
                      : 'bg-zinc-900/70 border-zinc-700 hover:border-emerald-500/50'
                  } flex items-center justify-between transition-all duration-200`}
                >
                  <div className='flex items-center'>
                    <div className='w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm'>
                      <config.icon className='h-full w-full scale-[0.8]' />
                    </div>
                    <span className='text-white capitalize'>{config.name}</span>
                  </div>
                  {platform === config.id && (
                    <Check className='h-5 w-5 text-green-400' />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <h3 className='text-base font-medium text-white mb-1'>
              Configuration
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {currentConfig?.description}
            </p>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='font-mono'>Webhook URL</Label>
                <p className='text-sm text-muted-foreground'>
                  Set this as HTTP POST request URL
                </p>
                <div className='flex'>
                  <Input
                    value={`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}?utm_source=${platform}`}
                    readOnly
                    className='rounded-r-none font-mono text-sm'
                  />
                  <Button
                    variant='secondary'
                    size={'icon'}
                    className='rounded-l-none'
                    onClick={() => {
                      copyToClipboard(
                        `${process.env.NEXT_PUBLIC_API_URL}${webhook.url}?utm_source=${platform}`,
                      );
                      const button =
                        document.activeElement as HTMLButtonElement;
                      const originalContent = button.innerHTML;
                      button.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                      setTimeout(() => {
                        button.innerHTML = originalContent;
                      }, 2000);
                    }}
                  >
                    <Clipboard className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              {currentConfig?.fields.map(field => (
                <div key={field.key} className='space-y-2'>
                  <Label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className='text-red-500'>*</span>}
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    {field.description}
                  </p>
                  {field.type === 'select' ? (
                    <Select
                      value={currentValues?.[field.key] || ''}
                      onValueChange={value => {
                        const updatedConfig = {
                          ...configValues,
                          [platform]: {
                            ...(currentValues || {}),
                            [field.key]: value,
                          },
                        };
                        setConfigValues(updatedConfig);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select...' />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className='flex'>
                      <Input
                        id={field.key}
                        type={
                          field.type === 'secret'
                            ? showSecret
                              ? 'text'
                              : 'password'
                            : 'text'
                        }
                        placeholder={field.placeholder}
                        className='rounded-r-none font-mono text-sm'
                        readOnly={field.readOnly || false}
                        value={currentValues?.[field.key] || ''}
                        onChange={e => {
                          const updatedConfig = {
                            ...configValues,
                            [platform]: {
                              ...(currentValues || {}),
                              [field.key]: e.target.value,
                            },
                          };
                          setConfigValues(updatedConfig);
                        }}
                      />

                      {field.type === 'secret' && (
                        <button
                          type='button'
                          className='bg-muted p-2 border border-l-0 border-input hover:bg-muted/70'
                          onClick={() => setShowSecret(prev => !prev)}
                        >
                          {!showSecret ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      )}
                      <Button
                        variant={'secondary'}
                        className='rounded-l-none'
                        size={'icon'}
                        onClick={() => {
                          const textToCopy = currentValues?.[field.key] || '';
                          copyToClipboard(textToCopy);
                          const button =
                            document.activeElement as HTMLButtonElement;
                          const originalContent = button.innerHTML;
                          button.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                          setTimeout(() => {
                            button.innerHTML = originalContent;
                          }, 2000);
                        }}
                      >
                        <Clipboard className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {currentConfig?.showSaveButton && (
                <div className='mt-4'>
                  <Button
                    onClick={handleConfigUpdate}
                    disabled={isLoading || isSaving}
                    size={'sm'}
                  >
                    {isLoading || isSaving ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : null}
                    {isLoading || isSaving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-medium'>Configure Notifications</h3>
              <Button variant='outline' size='sm' asChild>
                <a
                  href={
                    'https://docs.hookflo.com/notification-channels/overview'
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <ExternalLink className='h-4 w-4' />
                  View Docs
                </a>
              </Button>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    <span className='text-sm'>Email Notifications</span>
                  </div>
                  <Switch
                    checked={webhook.notify_email}
                    onCheckedChange={() =>
                      handleNotificationToggle('notify_email')
                    }
                    disabled={isLoading || isSaving}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowEmailConfig(true)}
                  >
                    {webhook.email_config ? 'Edit' : 'Configure'}
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <Slack className='h-4 w-4' />
                    <span className='text-sm'>Slack Notifications</span>
                  </div>
                  <Switch
                    checked={webhook.notify_slack}
                    onCheckedChange={() =>
                      handleNotificationToggle('notify_slack')
                    }
                    disabled={isLoading || isSaving}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowSlackConfig(true)}
                  >
                    {webhook.slack_config ? 'Edit' : 'Configure'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-medium'>Integration Guide</h3>
              {currentConfig?.docs && (
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={currentConfig.docs}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <ExternalLink className='h-4 w-4' />
                    View Docs
                  </a>
                </Button>
              )}
            </div>

            <div className='space-y-4'>
              {platform === 'supabase' && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>Supabase Integration</h4>
                  <p className='text-sm text-muted-foreground'>
                    Configure your Supabase database to send webhooks to this
                    endpoint.
                  </p>
                  <div className='bg-zinc-900 p-3 rounded-md text-xs font-mono overflow-x-auto'>
                    <p>1. Go to your Supabase project dashboard</p>
                    <p>2. Navigate to Database → Webhooks</p>
                    <p>3. Create a new webhook with the following settings:</p>
                    <p className='text-emerald-400 py-2'>
                      URL:{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}/utm_source=supabase`}
                    </p>
                    <br />
                    <p className='text-emerald-400 py-2'>
                      Headers:
                      <span>
                        x-webhook-id:{' '}
                        {currentValues?.webhook_id || 'your_webhook_id'}
                      </span>
                      <span>
                        x-webhook-token:{' '}
                        {currentValues?.webhook_token || 'your_webhook_token'}
                      </span>
                    </p>
                    <p>4. Select the events you want to trigger the webhook</p>
                  </div>
                </div>
              )}

              {platform === 'clerk' && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>Clerk Integration</h4>
                  <p className='text-sm text-muted-foreground'>
                    Configure Clerk to send webhooks to this endpoint.
                  </p>
                  <div className='bg-zinc-900 p-3 rounded-md text-xs font-mono overflow-x-auto'>
                    <p>1. Go to your Clerk dashboard</p>
                    <p>2. Navigate to Webhooks → Create Webhook</p>
                    <p>3. Set the following:</p>
                    <p className='text-emerald-400 py-2'>
                      Endpoint URL:{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}/utm_source=clerk`}
                    </p>
                    <p>4. Select the events you want to receive</p>
                    <p>5. Copy the generated signing secret</p>
                    <p>
                      6. Paste the signing secret in the "Signing Secret" field
                      and save configuration
                    </p>
                  </div>
                </div>
              )}

              {platform === 'dodoPayments' && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>
                    Dodo Payments Integration
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Configure Dodo Payments to send webhooks to this endpoint.
                  </p>
                  <div className='bg-zinc-900 p-3 rounded-md text-xs font-mono overflow-x-auto'>
                    <p>1. Go to your Dodo Payments dashboard</p>
                    <p>2. Navigate to Developer → Webhooks in Sidebar</p>
                    <p>3. Click "Add Webhook" button</p>
                    <p>4. Set the following:</p>
                    <p className='text-emerald-400 py-2'>
                      Endpoint URL:{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}/utm_source=dodoPayments`}
                    </p>
                    <p>5. Select the events you want to receive</p>
                    <p>6. Copy the generated signing secret</p>
                    <p>
                      7. Paste the signing secret in the "Signing Secret" field
                      and save configuration
                    </p>
                  </div>
                </div>
              )}

              {platform === 'stripe' && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>Stripe Integration</h4>
                  <p className='text-sm text-muted-foreground'>
                    Configure Stripe to send webhooks to this endpoint.
                  </p>
                  <div className='bg-zinc-900 p-3 rounded-md text-xs font-mono overflow-x-auto'>
                    <p>1. Go to your Stripe Dashboard</p>
                    <p>2. Navigate to Developers → Webhooks → Add endpoint</p>
                    <p>3. Configure the following:</p>
                    <p className='text-emerald-400 py-2'>
                      Endpoint URL:{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}/utm_source=stripe`}
                    </p>
                    <p>4. Choose the events you want to listen to</p>
                    <p>5. Click "Add endpoint" to save</p>
                    <p>
                      6. Reveal and copy the generated webhook signing secret
                    </p>
                    <p>
                      7. Paste the secret in the "Webhook signing Secret" field
                      and save configuration
                    </p>
                  </div>
                </div>
              )}

              {platform === 'github' && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>GitHub Integration</h4>
                  <p className='text-sm text-muted-foreground'>
                    Configure GitHub webhooks for your repository.
                  </p>
                  <div className='bg-zinc-900 p-3 rounded-md text-xs font-mono overflow-x-auto'>
                    <p>1. Go to your GitHub repository</p>
                    <p>2. Navigate to Settings → Webhooks → Add webhook</p>
                    <p>3. Enter the following details:</p>
                    <p className='text-emerald-400 py-2'>
                      Payload URL:{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}/utm_source=github`}
                    </p>
                    <br />
                    <p className='text-emerald-400 py-2'>
                      Secret: {currentValues?.signing_secret || 'your_secret'}
                    </p>
                    <p>4. Set Content type to "application/json"</p>
                    <p>5. Select the events you want to trigger the webhook</p>
                    <p>6. Create and copy the webhook secret</p>
                    <p>
                      7. Paste the secret in the "Webhook Secret" field and save
                      configuration
                    </p>
                  </div>
                </div>
              )}

              {platform === 'custom' && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>Custom Integration</h4>
                  <p className='text-sm text-muted-foreground'>
                    Use this webhook with your custom application.
                  </p>
                  <div className='bg-zinc-900 p-3 rounded-md text-xs font-mono overflow-x-auto'>
                    <p>Include these headers in your requests:</p>
                    <p className='text-emerald-400 py-2'>
                      x-webhook-id:{' '}
                      {currentValues?.webhook_id || 'your_webhook_id'}
                    </p>
                    <p className='text-emerald-400 py-2'>
                      x-webhook-token:{' '}
                      {currentValues?.webhook_token || 'your_webhook_token'}
                    </p>
                    <p className='mt-2'>Example request:</p>
                    <p className='text-emerald-400 py-2'>
                      curl -X POST{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`} \
                    </p>
                    <p className='pl-4'>-H "x-webhook-id: your_webhook_id" \</p>
                    <p className='pl-4'>
                      -H "x-webhook-token: your_webhook_token" \
                    </p>
                    <p className='pl-4'>
                      -H "Content-Type: application/json" \
                    </p>
                    <p className='pl-4'>-d "event" ":""test"</p>
                  </div>
                </div>
              )}

              {currentConfig?.verificationHeaders &&
                currentConfig.verificationHeaders.length > 0 && (
                  <div className='mt-4'>
                    <h4 className='text-sm font-medium mb-2'>
                      Required Headers
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {currentConfig.verificationHeaders.map(header => (
                        <Badge
                          key={header}
                          variant='outline'
                          className='font-mono text-xs'
                        >
                          {header}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {showEmailConfig && (
        <Dialog open={showEmailConfig} onOpenChange={setShowEmailConfig}>
          <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Email Configuration</DialogTitle>
            </DialogHeader>
            <EmailConfigForm
              webhook={webhook}
              onUpdate={async config => {
                await updateWebhookConfig(webhook.id, {
                  notify_email: true,
                  email_config: config,
                });
                setShowEmailConfig(false);
              }}
              onCancel={() => setShowEmailConfig(false)}
              isLoading={isLoading || isSaving}
            />
          </DialogContent>
        </Dialog>
      )}

      {showSlackConfig && (
        <Dialog open={showSlackConfig} onOpenChange={setShowSlackConfig}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Slack Configuration</DialogTitle>
            </DialogHeader>
            <SlackConfigForm
              webhook={webhook}
              onUpdate={async config => {
                await updateWebhookConfig(webhook.id, {
                  notify_slack: true,
                  slack_config: config,
                });
                setShowSlackConfig(false);
              }}
              onCancel={() => setShowSlackConfig(false)}
              isLoading={isLoading || isSaving}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function EmailConfigForm({
  webhook,
  onUpdate,
  onCancel,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (config: {
    recipient_email: string;
    template_id: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const initialEmails = webhook.email_config?.recipient_email
    ? webhook.email_config.recipient_email.split(',').map(e => e.trim())
    : [];

  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [input, setInput] = useState('');
  const [templateId, setTemplateId] = useState(
    webhook.email_config?.template_id || emailTemplates[0].id,
  );

  const addEmail = () => {
    const trimmed = input.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!trimmed || !isValid) {
      toast.error('Invalid email');
      return;
    }
    if (emails.includes(trimmed)) {
      toast.error('Duplicate email');
      return;
    }
    if (emails.length >= 3) {
      toast.error('Maximum 3 emails allowed');
      return;
    }
    setEmails([...emails, trimmed]);
    setInput('');
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = input.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    let finalEmails = [...emails];

    if (trimmed) {
      if (!isValid) {
        toast.error('Invalid email in input field');
        return;
      }
      if (finalEmails.includes(trimmed)) {
        toast.error('Duplicate email');
        return;
      }
      if (finalEmails.length >= 3) {
        toast.error('Maximum 3 emails allowed');
        return;
      }
      finalEmails.push(trimmed);
    }

    if (finalEmails.length === 0) {
      toast.error('At least one recipient email is required');
      return;
    }

    await onUpdate({
      recipient_email: finalEmails.join(','),
      template_id: templateId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='recipientEmail'>Recipient Emails*</Label>
          <Badge variant={'outline'} className='text-xs'>
            Max 3 allowed
          </Badge>
        </div>
        <div className='flex flex-wrap items-center gap-2 p-2 border rounded-md'>
          {emails.map(email => (
            <Badge key={email} variant='secondary'>
              {email}
              <button
                type='button'
                onClick={() => removeEmail(email)}
                className='ml-1 text-muted-foreground hover:text-foreground'
              >
                <X className='w-3 h-3' />
              </button>
            </Badge>
          ))}
          {emails.length < 3 ? (
            <Input
              id='recipientEmail'
              type='email'
              placeholder='Add email and press Enter'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addEmail();
                }
              }}
              className='flex-1 min-w-[200px] text-sm placeholder:text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0'
              disabled={isLoading}
            />
          ) : (
            <span className='text-xs text-muted-foreground pl-1'>
              Max 3 emails added
            </span>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='emailTemplate'>Template</Label>
          <Button variant='link' size='sm' asChild>
            <a
              href={`/dashboard/email-templates?templateId=${templateId}&webhookId=${webhook.id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ExternalLink className='h-4 w-4' />
              Preview Template
            </a>
          </Button>
        </div>
        <Select
          disabled={isLoading}
          value={templateId}
          onValueChange={value => setTemplateId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a template' />
          </SelectTrigger>
          <SelectContent>
            {EmailTemplateOptions.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className='flex justify-between'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading || emails.length === 0}>
          {isLoading ? (
            <Loader2 className='animate-spin h-4 w-4' />
          ) : (
            'Save Configuration'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

function SlackConfigForm({
  webhook,
  onUpdate,
  onCancel,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (config: {
    webhook_url: string;
    channel_name: string;
    template_id: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [slackConfig, setSlackConfig] = useState({
    webhook_url: webhook.slack_config?.webhook_url || '',
    channel_name: webhook.slack_config?.channel_name || '',
    template_id: webhook.slack_config?.template_id || 'basic',
  });

  useEffect(() => {
    if (!slackConfig.channel_name) {
      const randomChannelName = randomSlackChannelName();
      setSlackConfig(prev => ({
        ...prev,
        channel_name: randomChannelName,
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slackConfig.webhook_url) {
      toast.error('Error', { description: 'Webhook URL is required' });
      return;
    }
    await onUpdate(slackConfig);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-4'>
        <div className='grid w-full gap-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='slackWebhookUrl'>Slack Webhook URL *</Label>
            <Button variant='link' size='sm' asChild>
              <a
                href='https://docs.hookflo.com/notification-channels/slack'
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='h-4 w-4' />
                View Docs
              </a>
            </Button>
          </div>
          <Input
            id='slackWebhookUrl'
            required
            placeholder='Enter Slack webhook URL'
            value={slackConfig.webhook_url}
            onChange={e =>
              setSlackConfig({
                ...slackConfig,
                webhook_url: e.target.value,
              })
            }
            disabled={isLoading}
          />
        </div>
        <div className='grid w-full gap-2'>
          <Label htmlFor='slackChannel' className='flex items-center gap-2'>
            Channel Name{' '}
            <span className='text-sm text-muted-foreground'>(optional)</span>
          </Label>
          <Input
            id='slackChannel'
            placeholder='Enter channel name'
            value={slackConfig.channel_name}
            onChange={e =>
              setSlackConfig({
                ...slackConfig,
                channel_name: e.target.value,
              })
            }
            disabled={isLoading}
          />
          <p className='text-sm text-muted-foreground'>
            Random channel name. Edit as per your choice.
          </p>
        </div>
        <div className='grid w-full gap-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='slackTemplate'>Template</Label>
            <Button variant='link' size='sm' asChild>
              <a
                href={`/dashboard/slack-templates?templateId=${slackConfig.template_id}&webhookId=${webhook.id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='h-4 w-4' />
                Preview Template
              </a>
            </Button>
          </div>

          <Select
            disabled={isLoading}
            value={slackConfig.template_id || SlackTemplateOptions[0].id}
            onValueChange={value =>
              setSlackConfig({
                ...slackConfig,
                template_id: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select a template' />
            </SelectTrigger>
            <SelectContent>
              {SlackTemplateOptions.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className='flex justify-between'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading || !slackConfig.webhook_url}>
          {isLoading ? <Loader text='Saving...' /> : 'Save Configuration'}
        </Button>
      </DialogFooter>
    </form>
  );
}
