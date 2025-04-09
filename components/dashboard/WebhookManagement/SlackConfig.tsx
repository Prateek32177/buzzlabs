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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SlackTemplateOptions } from '@/const';
import { randomSlackChannelName } from '@/lib/utils';

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
    await onUpdate({ slack_config: slackConfig });
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
          <Label htmlFor='slackTemplate'>Template</Label>
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
