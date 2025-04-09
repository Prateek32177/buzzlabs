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
import { Loader2 } from 'lucide-react';
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
    template_id: webhook.email_config?.template_id || '',
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
        <Label htmlFor='emailTemplate'>Template</Label>
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
