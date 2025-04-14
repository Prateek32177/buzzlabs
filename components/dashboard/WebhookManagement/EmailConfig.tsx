import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Webhook } from './types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { EmailTemplateOptions } from '@/const';
import { emailTemplates } from '@/lib/templates';

export function EmailConfig({
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
  const [emailConfig, setEmailConfig] = useState({
    recipient_email: webhook.email_config?.recipient_email || '',
    template_id: webhook.email_config?.template_id || emailTemplates[0].id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConfig.recipient_email) {
      toast.error('Error', { description: 'Recipient email is required' });
      return;
    }
    await onUpdate({ email_config: emailConfig });
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
          value={emailConfig.template_id}
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
          size={'sm'}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          size={'sm'}
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
