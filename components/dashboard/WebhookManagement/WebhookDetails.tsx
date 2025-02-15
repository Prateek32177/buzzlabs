import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clipboard } from 'lucide-react';
import { Webhook } from './types';

interface WebhookDetailsProps {
  webhook: Webhook;
  onUpdate: (id: string, config: Partial<Webhook>) => Promise<void>;
  isLoading: boolean;
}

function WebhookDetails({ webhook, onUpdate, isLoading }: WebhookDetailsProps) {
  const [copied, setCopied] = useState(false);
  const testEndpoint = `/api/webhooks/${webhook.id}/test`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className='grid gap-6 py-4'>
      <div className='grid gap-4'>
        <Label>Integration Guide</Label>
        <div className='p-4 border rounded-lg space-y-4'>
          {/* Webhook URL */}
          <div className='space-y-2'>
            <h3 className='font-medium'>1. Your Webhook URL</h3>
            <div className='flex gap-2'>
              <Input
                value={webhook.url}
                readOnly
                className='flex-1 font-mono text-sm'
              />
              <Button onClick={() => copyToClipboard(webhook.url)}>
                <Clipboard className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Test Endpoint */}
          <div className='space-y-2'>
            <h3 className='font-medium'>2. Test Your Webhook</h3>
            <p className='text-sm text-muted-foreground'>
              Use this test endpoint to send sample payloads. The signature will
              be automatically generated.
            </p>
            <pre className='bg-muted p-3 rounded-md text-sm overflow-x-auto'>
              {`curl -X POST ${testEndpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"test":"data"}'`}
            </pre>
            <Button
              variant='secondary'
              className='mt-2'
              onClick={() =>
                copyToClipboard(`curl -X POST ${testEndpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"test":"data"}'`)
              }
            >
              Copy Test Command
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebhookDetails;
