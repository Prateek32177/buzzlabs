'use client';

import { useState } from 'react';
import type { Webhook } from './types';
import type { WebhookPlatform } from '@/lib/webhooks/types';
import { useWebhook } from './WebhookContext';
import { useClipboard } from './useClipboard';
import { platformConfigs } from '@/lib/webhooks/platforms/configs';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import {
  Check,
  Clipboard,
  Mail,
  Slack,
  EyeOff,
  Eye,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export function WebhookDetailsComp({
  webhook,
  onUpdate,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (id: string, config: Partial<Webhook>) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(webhook.name);
  const { setShowEmailConfig, setShowSlackConfig } = useWebhook();
  const { copyToClipboard } = useClipboard();
  const [platform, setPlatform] = useState<WebhookPlatform>('supabase');
  const [showSecret, setShowSecret] = useState(false);

  const [configValues, setConfigValues] = useState<Record<string, any>>(
    webhook.platformConfig || {},
  );
  const currentValues = (configValues[platform] || {}) as Record<string, any>;
  const currentConfig = platformConfigs[platform] || platformConfigs['custom'];

  const handlePlatformChange = (newPlatform: WebhookPlatform) => {
    setPlatform(newPlatform);
  };

  const handleNameUpdate = async () => {
    try {
      await onUpdate(webhook.id, { name });
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

      await onUpdate(webhook.id, updatedConfig);

      toast.success('Configuration updated successfully');
    } catch (error) {
      toast.error('Error', { description: 'Failed to update configuration' });
    }
  };

  return (
    <>
      <div className='grid gap-6 py-4'>
        <div className='grid gap-2'>
          <Label>Name</Label>
          <div className='flex gap-2'>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Webhook name'
              className='text-sm'
            />
            <Button
              onClick={handleNameUpdate}
              disabled={isLoading || name === webhook.name}
              size={'sm'}
            >
              {isLoading ? <Loader2 className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-zinc-900/10 backdrop-blur-md border border-zinc-500/20 rounded-xl p-6 shadow-lg'>
        <h4 className='text-base font-medium text-white mb-4'>
          1. Select an Application to integrate with
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                <div className='w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-sm'>
                  <config.icon className='h-full w-full scale-[0.8]' />
                </div>
                <span className='text-white capitalize'>{config.name}</span>
              </div>
              {platform === config.id && (
                <Check className='h-5 w-5 text-green-400' />
              )}
            </motion.div>
          ))}
        </div>
        <div className='space-y-4 my-8'>
          <div className='flex items-center justify-between mb-4 flex-wrap'>
            <div>
              <CardTitle className='mb-2 text-base font-medium text-white'>
                2. Configure Webhook
              </CardTitle>
              <CardDescription className=' mb-4'>
                {currentConfig!.description}
              </CardDescription>
            </div>
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
          <div className='grid gap-2 mt-4'>
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
                className='rounded-l-none'
                size={'icon'}
                onClick={() => {
                  copyToClipboard(
                    `${process.env.NEXT_PUBLIC_API_URL}${webhook.url}?utm_source=${platform}`,
                  );
                  const button = document.activeElement as HTMLButtonElement;
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
          {currentConfig!.fields.map(field => (
            <div key={field.key} className='grid gap-2 mt-4'>
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className='text-red-500'>*</span>}
              </Label>
              <p className='text-sm text-muted-foreground'>
                {field.description}
              </p>
              {field.type === 'select' ? (
                <Select
                  value={configValues[field.key]}
                  onValueChange={value =>
                    setConfigValues({ ...configValues, [field.key]: value })
                  }
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
          {currentConfig!.showSaveButton && (
            <div className='mt-4'>
              <Button
                onClick={handleConfigUpdate}
                disabled={isLoading}
                size={'sm'}
              >
                {isLoading ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between mb-4 flex-wrap'>
          <div>
            <CardTitle className='mb-2 text-base font-medium text-white'>
              3. Configure Notifications{' '}
              <span className='text-red-500 text-sm'>(Required)</span>
            </CardTitle>
            <CardDescription className='mb-4'>
              At least one notification channel must be configured to receive
              alerts.
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' asChild>
            <a
              href={'https://docs.hookflo.com/notification-channels/overview'}
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
                onCheckedChange={() => {
                  if (!webhook.email_config?.recipient_email) {
                    toast.error('Email configuration required', {
                      description: 'Please configure email settings first',
                    });
                    return;
                  }
                  onUpdate(webhook.id, {
                    notify_email: !webhook.notify_email,
                  });
                }}
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEmailConfig(webhook.id)}
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
                onCheckedChange={() => {
                  if (!webhook.slack_config?.channel_name) {
                    toast.error('Slack configuration required', {
                      description: 'Please configure Slack settings first',
                    });
                    return;
                  }
                  onUpdate(webhook.id, {
                    notify_slack: !webhook.notify_slack,
                  });
                }}
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center gap-2'>
              {webhook?.slack_config?.channel_name && (
                <Badge variant='outline' className='text-xs hidden sm:block'>
                  #{webhook.slack_config.channel_name}
                </Badge>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowSlackConfig(webhook.id)}
              >
                {webhook.slack_config ? 'Edit' : 'Configure'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function WebhookDetails({
  webhook,
  onUpdate,
  isLoading,
  open,
  onOpenChange,
}: {
  webhook: Webhook;
  onUpdate: (id: string, config: Partial<Webhook>) => void;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-[80%] md:w-[80vw] h-full overflow-y-auto border-l border-zinc-700 bg-zinc-900/80 backdrop-blur-lg shadow-xl rounded-none lg:rounded-tl-2xl lg:rounded-bl-2xl'
      >
        <SheetHeader className='mb-4'>
          <SheetTitle>Webhook Details</SheetTitle>
          <SheetDescription>
            Configure your webhook settings and notifications
          </SheetDescription>
        </SheetHeader>
        <WebhookDetailsComp
          webhook={webhook}
          onUpdate={onUpdate}
          isLoading={isLoading || false}
        />
      </SheetContent>
    </Sheet>
  );
}
