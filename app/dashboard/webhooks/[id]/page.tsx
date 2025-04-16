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
  Loader2,
  Mail,
  Slack,
  ExternalLink,
  Eye,
  EyeOff,
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

  useEffect(() => {
    if (webhookId) {
      fetchWebhook();
    }
  }, [webhookId]);

  useEffect(() => {
    if (webhook?.platformConfig) {
      try {
        const platformConfig =
          typeof webhook.platformConfig === 'string'
            ? JSON.parse(webhook.platformConfig)
            : webhook.platformConfig || {};

        const availablePlatforms = Object.keys(platformConfig);
        const platformValue =
          availablePlatforms.length > 0
            ? (availablePlatforms[0] as WebhookPlatform)
            : 'supabase';

        setPlatform(platformValue);

        setConfigValues(platformConfig);
      } catch (error) {
        console.error('Error parsing platform config:', error);
        setPlatform('supabase');
        setConfigValues({});
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
    setIsLoading(true);
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
      setWebhook(prev =>
        prev && prev.id === id ? { ...prev, ...updatedWebhook } : prev,
      );

      toast.success('Success', {
        description: 'Webhook configuration updated',
      });
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to update webhook',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformChange = (newPlatform: WebhookPlatform) => {
    setPlatform(newPlatform);

    if (!configValues[newPlatform]) {
      setConfigValues(prev => ({
        ...prev,
        [newPlatform]: {},
      }));
    }
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
    if (!webhook) return;

    try {
      const currentValues = configValues[platform] || {};
      const currentConfig = platformConfigs[platform];

      const missingFields = currentConfig?.fields
        .filter(field => field.required && !currentValues[field.key])
        .map(field => field.label);

      if (missingFields && missingFields.length > 0) {
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

      await updateWebhookConfig(webhook.id, updatedConfig);

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

  if (isLoading && !webhook) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>Loading webhook details...</p>
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
            <h3 className='text-lg font-medium'>Basic Information</h3>
            <div className='flex items-center justify-between '>
              <span className='text-sm text-muted-foreground'>
                Status: {webhook.is_active ? 'Active' : 'Disabled'}
              </span>
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
                disabled={isLoading}
              />
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
                />
                <Button onClick={handleNameUpdate} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>

            <div className='grid gap-2'>
              <Label>Webhook URL</Label>
              <div className='flex'>
                <Input
                  value={`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}?utm_source=${platform}`}
                  readOnly
                  className='rounded-r-none font-mono text-sm'
                />
                <Button
                  variant='secondary'
                  className='rounded-l-none'
                  onClick={() =>
                    copyToClipboard(
                      `${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`,
                    )
                  }
                >
                  <Clipboard className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <h3 className='text-lg font-medium text-white mb-4'>
              Select an Application to integrate with
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {Object.values(platformConfigs).map(config => (
                <motion.div
                  key={config.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlatformChange(config.id)}
                  className={`cursor-pointer p-4 rounded-lg border ${
                    platform === config.id
                      ? 'bg-emerald-600/20 border-emerald-500 shadow-sm'
                      : 'bg-zinc-900/70 border-zinc-700 hover:border-emerald-500/50'
                  } flex items-center justify-between transition-all duration-200`}
                >
                  <div className='flex items-center'>
                    <div className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mr-3 shadow-sm'>
                      <config.icon className='w-5 h-5 text-emerald-500' />
                    </div>
                    <span className='text-white capitalize'>{config.name}</span>
                  </div>
                  {platform === config.id && (
                    <Check className='h-5 w-5 text-green-400' />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <h3 className='text-lg font-medium text-white mb-4'>
              Configuration
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>
              {currentConfig?.description}
            </p>

            <div className='space-y-4'>
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
                          className='bg-muted p-2 border border-l-0 border-input  hover:bg-muted/70'
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
                          navigator.clipboard
                            .writeText(textToCopy)
                            .then(() => {
                              toast.success('Copied to clipboard', {
                                description:
                                  'The value has been copied to your clipboard.',
                              });
                            })
                            .catch(() => {
                              toast.error('Failed to copy', {
                                description: 'Unable to copy to clipboard.',
                              });
                            });
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
                    disabled={isLoading}
                    size={'sm'}
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : null}
                    Save Configuration
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
            <h3 className='text-lg font-medium text-white mb-4'>
              Notification Settings
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={webhook.notify_email}
                    onCheckedChange={() =>
                      handleNotificationToggle('notify_email')
                    }
                    disabled={isLoading}
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
                    <span>Slack Notifications</span>
                  </div>
                  <Switch
                    checked={webhook.notify_slack}
                    onCheckedChange={() =>
                      handleNotificationToggle('notify_slack')
                    }
                    disabled={isLoading}
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
              <h3 className='text-lg font-medium'>Integration Guide</h3>
              {currentConfig?.docs && (
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={currentConfig.docs}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <ExternalLink className='h-4 w-4 mr-2' />
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
                    <p className='text-emerald-400'>
                      URL: {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`}
                    </p>
                    <p className='text-emerald-400'>Headers:</p>
                    <p className='pl-4'>
                      x-webhook-id:{' '}
                      {currentValues?.webhook_id || 'your_webhook_id'}
                    </p>
                    <p className='pl-4'>
                      x-webhook-token:{' '}
                      {currentValues?.webhook_token || 'your_webhook_token'}
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
                    <p className='text-emerald-400'>
                      Endpoint URL:{' '}
                      {`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`}
                    </p>
                    <p className='text-emerald-400'>
                      Signing Secret:{' '}
                      {currentValues?.signing_secret || 'your_signing_secret'}
                    </p>
                    <p>4. Select the events you want to receive</p>
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
                    <p className='text-emerald-400'>
                      x-webhook-id:{' '}
                      {currentValues?.webhook_id || 'your_webhook_id'}
                    </p>
                    <p className='text-emerald-400'>
                      x-webhook-token:{' '}
                      {currentValues?.webhook_token || 'your_webhook_token'}
                    </p>
                    <p className='mt-2'>Example request:</p>
                    <p className='text-emerald-400'>
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

              {currentConfig?.verificationHeaders && (
                <div className='mt-4'>
                  <h4 className='text-sm font-medium mb-2'>Required Headers</h4>
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
              isLoading={isLoading}
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
              isLoading={isLoading}
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
  const [emailConfig, setEmailConfig] = useState({
    recipient_email: webhook.email_config?.recipient_email || '',
    template_id: webhook.email_config?.template_id || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConfig.recipient_email) {
      toast.error('Error', { description: 'Recipient email is required' });
      return;
    }
    await onUpdate(emailConfig);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='recipientEmail'>Recipient Email *</Label>
        <Input
          id='recipientEmail'
          type='email'
          required
          placeholder='Enter recipient email'
          value={emailConfig.recipient_email}
          onChange={e =>
            setEmailConfig({
              ...emailConfig,
              recipient_email: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='emailTemplate'>Template</Label>
          <Button variant='link' size='sm' asChild>
            <a
              href={`/dashboard/email-templates?templateId=${emailConfig.template_id}&webhookId=${webhook.id}`}
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
          value={emailConfig.template_id || emailTemplates[0].id}
          onValueChange={value =>
            setEmailConfig({
              ...emailConfig,
              template_id: value,
            })
          }
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
        <Button
          type='submit'
          disabled={isLoading || !emailConfig.recipient_email}
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Saving...
            </>
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
  const [slackConfig, setSlackConfig] = useState(
    webhook.slack_config || {
      webhook_url: '',
      channel_name: '',
      template_id: '',
    },
  );

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
          <Label htmlFor='slackWebhookUrl'>Webhook URL *</Label>
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
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
