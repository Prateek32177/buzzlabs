'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clipboard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IntegrationsGuide() {
  const [activeTab, setActiveTab] = useState('overview');
  const [testPayload, setTestPayload] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold'>Integrations Guide</h1>
        <p className='text-muted-foreground mt-2'>
          Learn how to integrate and test your webhooks
        </p>
      </div>

      <Tabs
        defaultValue='overview'
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='testing'>Testing</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>How Webhooks Work</CardTitle>
              <CardDescription>Understanding the webhook flow</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4'>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold mb-2'>1. Webhook Creation</h3>
                  <p>
                    Create a webhook in your dashboard and get your unique
                    webhook URL and secret.
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold mb-2'>
                    2. Security Implementation
                  </h3>
                  <p>
                    Use your webhook secret to generate signatures for each
                    request.
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold mb-2'>3. Send Webhooks</h3>
                  <p>
                    Send HTTP POST requests to your webhook URL with the
                    required headers and payload.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Security Implementation</CardTitle>
              <CardDescription>
                How to secure your webhook requests
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <h3 className='font-medium'>1. Generate Signature</h3>
                  <div className='bg-muted p-4 rounded-lg space-y-2'>
                    <p className='text-sm'>
                      For each webhook request, generate a signature:
                    </p>
                    <pre className='text-sm overflow-x-auto bg-background p-2 rounded'>
                      {`signature = HMAC_SHA256(
  key: your_webhook_secret,
  message: JSON.stringify(payload)
).toString('hex')`}
                    </pre>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h3 className='font-medium'>2. Implementation Examples</h3>
                  <div className='bg-muted p-4 rounded-lg space-y-4'>
                    <div>
                      <p className='text-sm font-medium mb-2'>Node.js:</p>
                      <pre className='text-sm overflow-x-auto bg-background p-2 rounded'>
                        {`const crypto = require('crypto');

function generateSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

// Usage
const payload = { "event": "user.created", "data": {...} };
const signature = generateSignature(payload, webhookSecret);

await fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-signature': signature
  },
  body: JSON.stringify(payload)
});`}
                      </pre>
                    </div>

                    <div>
                      <p className='text-sm font-medium mb-2'>Python:</p>
                      <pre className='text-sm overflow-x-auto bg-background p-2 rounded'>
                        {`import hmac
import hashlib
import json
import requests

def generate_signature(payload, secret):
    return hmac.new(
        secret.encode('utf-8'),
        json.dumps(payload).encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

# Usage
payload = {"event": "user.created", "data": {...}}
signature = generate_signature(payload, webhook_secret)

requests.post(
    webhook_url,
    headers={
        'Content-Type': 'application/json',
        'x-webhook-signature': signature
    },
    json=payload
)`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='testing' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Test Your Integration</CardTitle>
              <CardDescription>
                Send test requests to verify your implementation
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='grid gap-2'>
                  <Label>Test Payload</Label>
                  <Input
                    placeholder='Enter your webhook URL'
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                  />
                  <textarea
                    className='min-h-[200px] w-full p-4 rounded-md border bg-background font-mono text-sm'
                    value={testPayload}
                    onChange={e => setTestPayload(e.target.value)}
                    placeholder={`{
  "event": "test_event",
  "data": {
    "message": "Hello World"
  }
}`}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>cURL Command</Label>
                  <pre className='bg-muted p-4 rounded-lg text-sm overflow-x-auto'>
                    {`curl -X POST ${webhookUrl || 'YOUR_WEBHOOK_URL'} \\
  -H "Content-Type: application/json" \\
  -H "x-webhook-signature: YOUR_GENERATED_SIGNATURE" \\
  -d '${testPayload || '{"event":"test_event","data":{"message":"Hello World"}}"'}'`}
                  </pre>
                  <Button
                    variant='secondary'
                    onClick={() =>
                      copyToClipboard(
                        `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -H "x-webhook-signature: YOUR_GENERATED_SIGNATURE" \\
  -d '${testPayload}'`,
                      )
                    }
                  >
                    <Clipboard className='h-4 w-4 mr-2' />
                    Copy cURL Command
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
