import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CreateWebhookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWebhookCreated: () => void;
  initialName?: string;
}

export function CreateWebhookDialog({
  open,
  onOpenChange,
  onWebhookCreated,
  initialName = '',
}: CreateWebhookDialogProps) {
  const [webhookName, setWebhookName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  // Update webhook name when initialName changes
  useEffect(() => {
    setWebhookName(initialName);
  }, [initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!webhookName.trim() || webhookName.trim().length < 3) {
      toast.error('Validation Error', {
        description: 'Webhook name must be at least 3 characters long',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: webhookName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create webhook');
      }

      const webhook = await response.json();

      toast.success('Webhook Created! 🎉', {
        description: `${webhookName} is ready to receive notifications.`,
      });

      setWebhookName('');
      onOpenChange(false);
      onWebhookCreated();
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to create webhook',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm rounded-sm'>
        <DialogHeader>
          <DialogTitle>Create New Webhook</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='webhook-name' className='text-sm font-medium'>
              Webhook Name
            </Label>
            <Input
              id='webhook-name'
              type='text'
              placeholder='e.g. User Signup Notifications'
              value={webhookName}
              onChange={e => setWebhookName(e.target.value)}
              className='focus:ring-2 focus:ring-primary/20 border-border/60 placeholder:text-xs text-sm'
              required
              minLength={3}
              disabled={isLoading}
            />
            <p className='text-xs text-muted-foreground'>
              Minimum 3 characters required
            </p>
          </div>

          <Button
            type='submit'
            disabled={
              isLoading || !webhookName.trim() || webhookName.trim().length < 3
            }
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
