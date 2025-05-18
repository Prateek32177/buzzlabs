import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { ExternalLink, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { EmailTemplateOptions } from '@/const';
import { emailTemplates } from '@/lib/templates';
import { Webhook } from './types';
import { Badge } from '@/components/ui/badge';

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
      email_config: {
        recipient_email: finalEmails.join(','),
        template_id: templateId,
      },
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
          size='sm'
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          size='sm'
          disabled={isLoading || emails.length === 0}
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
