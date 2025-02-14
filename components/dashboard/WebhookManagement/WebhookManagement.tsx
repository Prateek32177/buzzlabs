'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Eye, Trash2, Slack, Mail, Loader2 } from 'lucide-react';

type Webhook = {
  id: string;
  name: string;
  url: string;
  secret: string;
  isActive: boolean;
  notifyEmail: boolean;
  notifySlack: boolean;
  emailConfig: {
    recipientEmail: string;
    templateId: string;
  } | null;
  slackConfig: {
    webhookUrl: string;
    channelName: string;
    templateId: string;
  } | null;
};

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhooks');
      if (!response.ok) throw new Error('Failed to fetch webhooks');
      const data = await response.json();
      setWebhooks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch webhooks',
        variant: 'destructive',
      });
    }
  };

  const addWebhook = async () => {
    if (newWebhookName) {
      try {
        const response = await fetch('/api/webhooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newWebhookName }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create webhook');
        }

        const webhook = await response.json();
        setWebhooks([...webhooks, webhook]);
        setNewWebhookName('');
        toast({
          title: 'Webhook Created',
          description: `New webhook "${newWebhookName}" has been created.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to create webhook',
          variant: 'destructive',
        });
      }
    }
  };

  const toggleWebhook = async (
    id: string,
    field: 'isActive' | 'notifyEmail' | 'notifySlack',
  ) => {
    try {
      setIsLoading(true);
      const webhook = webhooks.find(w => w.id === id);
      if (!webhook) return;

      // Convert camelCase to snake_case for the API
      const fieldMapping = {
        isActive: 'is_active',
        notifyEmail: 'notify_email',
        notifySlack: 'notify_slack',
      };

      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [fieldMapping[field]]: !webhook[field],
        }),
      });

      if (!response.ok) throw new Error('Failed to update webhook');

      const updatedWebhook = await response.json();
      setWebhooks(webhooks.map(w => (w.id === id ? updatedWebhook : w)));
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update webhook',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete webhook');

      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      toast({
        title: 'Webhook Deleted',
        description: 'The webhook has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete webhook',
        variant: 'destructive',
      });
    }
  };

  const updateWebhookConfig = async (id: string, config: Partial<Webhook>) => {
    try {
      setIsLoading(true);
      // Convert frontend field names to match backend
      const updates = {
        name: config.name,
        is_active: config.isActive,
        notify_email: config.notifyEmail,
        notify_slack: config.notifySlack,
        email_config: config.emailConfig,
        slack_config: config.slackConfig,
      };

      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update webhook');

      const updatedWebhook = await response.json();
      setWebhooks(
        webhooks.map(webhook => (webhook.id === id ? updatedWebhook : webhook)),
      );

      toast({
        title: 'Success',
        description: 'Configuration updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update webhook',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecret = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The text has been copied to your clipboard.',
    });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Webhook</CardTitle>
          <CardDescription>
            Add a new webhook to your notification system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2'>
            <Input
              placeholder='New Webhook Name'
              value={newWebhookName}
              onChange={e => setNewWebhookName(e.target.value)}
            />
            <Button onClick={addWebhook}>Add Webhook</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Webhooks</CardTitle>
          <CardDescription>
            View and manage your existing webhooks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notifications</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map(webhook => (
                  <TableRow key={webhook.id}>
                    <TableCell>{webhook.name}</TableCell>
                    <TableCell>
                      <Switch
                        checked={webhook.isActive}
                        onCheckedChange={() =>
                          toggleWebhook(webhook.id, 'isActive')
                        }
                        disabled={isLoading}
                      />
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <Badge
                          variant={
                            webhook.notifyEmail ? 'default' : 'secondary'
                          }
                          className={`py-2 px-3 cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                          onClick={() =>
                            !isLoading &&
                            toggleWebhook(webhook.id, 'notifyEmail')
                          }
                        >
                          <Mail className='w-4 h-4 mr-2' />
                          Email
                        </Badge>
                        <Badge
                          className={`py-2 px-3 cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                          variant={
                            webhook.notifySlack ? 'default' : 'secondary'
                          }
                          onClick={() =>
                            !isLoading &&
                            toggleWebhook(webhook.id, 'notifySlack')
                          }
                        >
                          <Slack className='w-4 h-4 mr-2' />
                          Slack
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <WebhookDetails
                          webhook={webhook}
                          onUpdate={updateWebhookConfig}
                          isLoading={isLoading}
                        />
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WebhookDetails({
  webhook,
  onUpdate,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (id: string, config: Partial<Webhook>) => void;
  isLoading: boolean;
}) {
  const { toast } = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The text has been copied to your clipboard.',
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <Eye className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{webhook.name}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='url' className='text-right'>
              URL
            </Label>
            <Input
              id='url'
              value={webhook.url}
              readOnly
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='secret' className='text-right'>
              Secret
            </Label>
            <div className='col-span-3 flex'>
              <Input
                id='secret'
                value={webhook.secret}
                readOnly
                className='rounded-r-none'
              />
              <Button
                variant='secondary'
                className='rounded-l-none'
                onClick={() => copyToClipboard(webhook.secret)}
              >
                <Clipboard className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email
            </Label>
            <div className='col-span-3 flex items-center space-x-2'>
              <Switch
                id='email'
                checked={webhook.notifyEmail}
                onCheckedChange={() =>
                  onUpdate(webhook.id, { notifyEmail: !webhook.notifyEmail })
                }
              />
              {webhook.notifyEmail && (
                <EmailConfig
                  webhook={webhook}
                  onUpdate={config => onUpdate(webhook.id, config)}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='slack' className='text-right'>
              Slack
            </Label>
            <div className='col-span-3 flex items-center space-x-2'>
              <Switch
                id='slack'
                checked={webhook.notifySlack}
                onCheckedChange={() =>
                  onUpdate(webhook.id, { notifySlack: !webhook.notifySlack })
                }
              />
              {webhook.notifySlack && (
                <SlackConfig
                  webhook={webhook}
                  onUpdate={config => onUpdate(webhook.id, config)}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmailConfig({
  webhook,
  onUpdate,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (config: Partial<Webhook>) => void;
  isLoading: boolean;
}) {
  const [emailConfig, setEmailConfig] = useState(
    webhook.emailConfig || {
      recipientEmail: '',
      templateId: '',
    },
  );
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      emailConfig: emailConfig,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={isLoading}>
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='recipientEmail' className='text-right'>
                Recipient
              </Label>
              <Input
                id='recipientEmail'
                value={emailConfig.recipientEmail}
                onChange={e =>
                  setEmailConfig({
                    ...emailConfig,
                    recipientEmail: e.target.value,
                  })
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='emailTemplate' className='text-right'>
                Template
              </Label>
              <Select
                onValueChange={value =>
                  setEmailConfig({
                    ...emailConfig,
                    templateId: value,
                  })
                }
                value={emailConfig.templateId}
              >
                <SelectTrigger id='emailTemplate' className='col-span-3'>
                  <SelectValue placeholder='Select a template' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='template1'>Template 1</SelectItem>
                  <SelectItem value='template2'>Template 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SlackConfig({
  webhook,
  onUpdate,
  isLoading,
}: {
  webhook: Webhook;
  onUpdate: (config: Partial<Webhook>) => void;
  isLoading: boolean;
}) {
  const [slackConfig, setSlackConfig] = useState(
    webhook.slackConfig || {
      webhookUrl: '',
      channelName: '',
      templateId: '',
    },
  );
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      slackConfig: slackConfig,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={isLoading}>
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='slackWebhookUrl' className='text-right'>
                Webhook URL
              </Label>
              <Input
                id='slackWebhookUrl'
                value={slackConfig?.webhookUrl}
                onChange={e =>
                  setSlackConfig({
                    ...slackConfig,
                    webhookUrl: e.target.value,
                    channelName: webhook.slackConfig?.channelName || '',
                    templateId: webhook.slackConfig?.templateId || '',
                  })
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='slackChannel' className='text-right'>
                Channel
              </Label>
              <Input
                id='slackChannel'
                value={slackConfig.channelName}
                onChange={e =>
                  setSlackConfig({
                    ...slackConfig,
                    webhookUrl: webhook.slackConfig?.webhookUrl || '',
                    channelName: e.target.value,
                    templateId: webhook.slackConfig?.templateId || '',
                  })
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='slackTemplate' className='text-right'>
                Template
              </Label>
              <Select
                onValueChange={value =>
                  setSlackConfig({
                    ...slackConfig,
                    webhookUrl: webhook.slackConfig?.webhookUrl || '',
                    channelName: webhook.slackConfig?.channelName || '',
                    templateId: value,
                  })
                }
                value={slackConfig.templateId}
              >
                <SelectTrigger id='slackTemplate' className='col-span-3'>
                  <SelectValue placeholder='Select a template' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='template1'>Template 1</SelectItem>
                  <SelectItem value='template2'>Template 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
