import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { platformConfigs } from '@/lib/webhooks/platforms/configs';
import { WebhookPlatform } from '@/lib/webhooks/types';

// import { CopyButton } from '@/components/ui/copy-button';
import { Card } from '@/components/ui/card';
import { Webhook } from './types';

interface PlatformConfigProps {
  webhook: Webhook;
  onUpdate: (config: Partial<Webhook>) => Promise<void>;
  isLoading: boolean;
}

export function PlatformConfig({
  webhook,
  onUpdate,
  isLoading,
}: PlatformConfigProps) {
  const [platform, setPlatform] = useState<WebhookPlatform>('supabase');
  const [configValues, setConfigValues] = useState<Record<string, string>>(
    webhook.platformConfig,
  );

  const currentConfig = platformConfigs[platform] || platformConfigs['custom'];

  const handlePlatformChange = (newPlatform: WebhookPlatform) => {
    setPlatform(newPlatform);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      platformConfig: configValues,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <Label>Integration Platform</Label>
        <div className='grid grid-cols-3 gap-4'>
          {Object.values(platformConfigs).map(config => (
            <Button
              key={config.id}
              type='button'
              variant={platform === config.id ? 'default' : 'outline'}
              className='flex flex-col items-center justify-center h-24 gap-2'
              onClick={() => handlePlatformChange(config.id)}
            >
              <config.icon className='h-full w-full scale-[0.8]' />
              <span>{config.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={platform}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <Label>Configuration</Label>
            <Card className='p-4'>
              <p className='text-sm text-muted-foreground mb-4'>
                {currentConfig!.description}
              </p>

              {currentConfig!.fields.map(field => (
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
                    <Input
                      id={field.key}
                      type={field.type === 'secret' ? 'password' : 'text'}
                      placeholder={field.placeholder}
                      value={configValues[field.key] || ''}
                      onChange={e =>
                        setConfigValues({
                          ...configValues,
                          [field.key]: e.target.value,
                        })
                      }
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </Card>
          </div>

          {currentConfig!.docs && (
            <p className='text-sm text-muted-foreground'>
              For more information, see the{' '}
              <a
                href={currentConfig!.docs}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:underline'
              >
                {currentConfig!.name} documentation
              </a>
              .
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className='flex justify-end gap-4'>
        <Button
          type='submit'
          disabled={isLoading || !Object.keys(configValues).length}
        >
          Save Configuration
        </Button>
      </div>
    </form>
  );
}
