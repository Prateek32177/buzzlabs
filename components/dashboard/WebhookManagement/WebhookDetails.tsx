import { useState } from 'react';
import { Webhook } from './types';
import { WebhookPlatform } from '@/lib/webhooks/types';
import { useWebhook } from './WebhookContext';
import { useClipboard } from './useClipboard';
import { platformConfigs } from '@/lib/webhooks/platforms/configs';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Mail, Slack } from 'lucide-react';
import { Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function WebhookDetails({
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

  const [configValues, setConfigValues] = useState<Record<string, any>>(
    webhook.platformConfig || {},
  );
  const currentValues = (configValues[platform] || {}) as Record<string, any>;
  const currentConfig = platformConfigs[platform];
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
      const missingFields = currentConfig.fields
        .filter(field => field.required && !currentValues[field.key])
        .map(field => field.label);

      if (missingFields.length > 0) {
        toast.error('Error', {
          description: `Missing required fields: ${missingFields.join(', ')}`,
        });
        return;
      }

      await onUpdate(webhook.id, {
        platformConfig: {
          platform,
          config: JSON.stringify(configValues),
        },
      });

      toast.success('Configuration updated successfully');
    } catch (error) {
      toast.error('Error', { description: 'Failed to update configuration' });
    }
  };

  return (
    <div className='grid gap-6 py-4'>
      <div className='grid gap-2'>
        <Label>Name</Label>
        <div className='flex gap-2'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Webhook name'
          />
          <Button
            onClick={handleNameUpdate}
            disabled={isLoading || name === webhook.name}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Save'}
          </Button>
        </div>
      </div>

      <div className='grid gap-2'>
        <Label>Webhook URL</Label>
        <div className='flex'>
          <Input
            value={`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`}
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
      <div className='bg-purple-900/10 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 shadow-lg'>
        <h4 className='text-lg font-medium text-white mb-4'>
          1. Select an Application
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.values(platformConfigs).map(config => (
            <motion.div
              key={config.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlatformChange(config.id)}
              className={`cursor-pointer p-4 rounded-lg border ${
                platform === config.id
                  ? 'bg-purple-600/20 border-purple-500 shadow-sm'
                  : 'bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50'
              } flex items-center justify-between transition-all duration-200`}
            >
              <div className='flex items-center'>
                <div className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mr-3 shadow-sm'>
                  {config.id === 'supabase' && (
                    <svg
                      viewBox='0 0 24 24'
                      className='w-6 h-6 text-emerald-500'
                      fill='currentColor'
                    >
                      <path d='M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z' />
                    </svg>
                  )}
                  {config.id === 'clerk' && (
                    <svg
                      viewBox='0 0 24 24'
                      className='w-6 h-6 text-white'
                      fill='currentColor'
                    >
                      <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                    </svg>
                  )}
                  {/* {config.id === 'custom' && (
                    <svg
                      viewBox='0 0 24 24'
                      className='w-6 h-6 text-blue-500'
                      fill='currentColor'
                    >
                      <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z' />
                    </svg>
                  )} */}
                </div>
                <span className='text-white capitalize'>{config.name}</span>
              </div>
              {platform === config.id && (
                <Check className='h-5 w-5 text-purple-400' />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className='space-y-4'>
        <Label>Configuration</Label>
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground mb-4'>
            {currentConfig.description}
          </p>

          {currentConfig.fields.map(field => (
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
                    type={field.type === 'secret' ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    className='rounded-r-none font-mono text-sm'
                    // readOnly={currentValues?.[field.readOnly]||true}
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
                  <Button>
                    <Clipboard className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* <div className='grid gap-2'>
        <Label>
          Secret{' '}
          <code className='ml-2 text-sm text-muted-foreground font-mono whitespace-nowrap bg-muted px-2 py-1 rounded-sm'>
            set in x-webhook-token header value
          </code>
        </Label>
        <div className='flex'>
          <Input
            type='text'
            value={webhook.secret}
            readOnly
            className='rounded-r-none font-mono text-sm'
          />
          <Button
            variant='secondary'
            className='rounded-l-none'
            onClick={() => copyToClipboard(webhook.secret)}
          >
            <Clipboard className='h-4 w-4' />
          </Button>
        </div>
      </div> */}
      {/* <PlatformConfig
        webhook={webhook}
        onUpdate={onUpdate}
        isLoading={isLoading}
      /> */}
      <div className='grid gap-4'>
        <Label>Notification Settings</Label>
        <div className='space-y-4 p-4 border rounded-lg'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <span>Email Notifications</span>
              </div>
              <Switch
                checked={webhook.notify_email}
                onCheckedChange={() =>
                  onUpdate(webhook.id, { notify_email: !webhook.notify_email })
                }
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center gap-2'>
              {webhook.email_config && (
                <Badge variant='outline' className='text-xs'>
                  {webhook.email_config.recipient_email}
                </Badge>
              )}
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
                <span>Slack Notifications</span>
              </div>
              <Switch
                checked={webhook.notify_slack}
                onCheckedChange={() =>
                  onUpdate(webhook.id, { notify_slack: !webhook.notify_slack })
                }
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center gap-2'>
              {webhook.slack_config && (
                <Badge variant='outline' className='text-xs'>
                  {webhook.slack_config.channel_name}
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
    </div>
  );
}
