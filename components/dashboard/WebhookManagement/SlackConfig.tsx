import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Webhook } from './types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { SlackTemplateOptions } from '@/const';
import { randomSlackChannelName } from '@/lib/utils';
import { slackTemplates } from '@/lib/slack-templates';
import { Loader2 } from 'lucide-react';

export function SlackConfig({
  webhook,
  onUpdate,
  onCancel,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (config: Partial<Webhook>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [slackConfig, setSlackConfig] = useState({
    webhook_url: webhook.slack_config?.webhook_url || '',
    channel_name: webhook.slack_config?.channel_name || '',
    template_id: webhook.slack_config?.template_id || slackTemplates[0].id,
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
    await onUpdate({ slack_config: slackConfig });
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
            value={slackConfig.template_id}
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
          size={'sm'}
          variant='outline'
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          size={'sm'}
          disabled={isLoading || !slackConfig.webhook_url}
        >
          {isLoading ? (
            <Loader2 className='animate-spin w-4 h-4' />
          ) : (
            'Save Configuration'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
