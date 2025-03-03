'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
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
import {
  Clipboard,
  Eye,
  Trash2,
  Slack,
  Mail,
  Loader2,
  Settings,
} from 'lucide-react';
import { WebhookContext, useWebhook } from './WebhookContext';
import { useClipboard } from './useClipboard';
import { PlatformConfig } from './PlatformConfig';
import { SlackTemplateOptions, EmailTemplateOptions } from '@/const';
import { Webhook, WebhookContextType } from './types';

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingId, setIsLoadingId] = useState<string | null>(null);
  const [showEmailConfig, setShowEmailConfig] = useState<string | null>(null);
  const [showSlackConfig, setShowSlackConfig] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setIsFetching(true);
      const response = await fetch('/api/webhooks');
      if (!response.ok) throw new Error('Failed to fetch webhooks');
      const data = await response.json();
      setWebhooks(data);
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to fetch webhooks',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const addWebhook = async () => {
    setIsLoading(true);
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
        setIsLoading(false);
        toast.success('Webhook Created', {
          description: `New webhook ${newWebhookName} has been created.`,
        });
      } catch (error) {
        setIsLoading(false);
        toast.error('Error', {
          description:
            error instanceof Error ? error.message : 'Failed to create webhook',
        });
      }
    }
  };

  const toggleWebhook = async (
    id: string,
    field: 'isActive' | 'notifyEmail' | 'notifySlack',
  ) => {
    try {
      setIsLoadingId(id);
      const webhook = webhooks.find(w => w.id === id);
      if (!webhook) return;

      const updates = {
        is_active:
          field === 'isActive' ? !webhook.is_active : webhook.is_active,
        notify_email:
          field === 'notifyEmail'
            ? !webhook.notify_email
            : webhook.notify_email,
        notify_slack:
          field === 'notifySlack'
            ? !webhook.notify_slack
            : webhook.notify_slack,
      };

      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update webhook');
      }

      const updatedWebhook = await response.json();
      setWebhooks(webhooks.map(w => (w.id === id ? updatedWebhook : w)));

      // Show config dialog if enabling notifications
      if (field === 'notifyEmail' && updates.notify_email) {
        // Show email config dialog
        setShowEmailConfig(id);
      }
      if (field === 'notifySlack' && updates.notify_slack) {
        // Show slack config dialog
        setShowSlackConfig(id);
      }
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to update webhook',
      });
    } finally {
      setIsLoadingId(null);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete webhook');

      setWebhooks(webhooks.filter(webhook => webhook.id !== id));

      toast.success('Webhook Deleted', {
        description: 'The webhook has been deleted.',
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete webhook',
      });
    }
  };

  const updateWebhookConfig = async (id: string, config: Partial<Webhook>) => {
    setIsLoadingId(id);
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update webhook');
      }

      const updatedWebhook = await response.json();
      setWebhooks(
        webhooks.map(w => (w.id === id ? { ...w, ...updatedWebhook } : w)),
      );

      toast.success('Success', {
        description: 'Webhook configuration updated',
      });
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to update webhook',
      });
    } finally {
      setIsLoadingId(null);
    }
  };

  const handleNotificationToggle = async (
    id: string,
    field: 'notifyEmail' | 'notifySlack',
  ) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;
    // If trying to enable, show config first
    else if (!webhook[field as keyof Webhook]) {
      if (field === 'notifyEmail') {
        setShowEmailConfig(id);
      } else {
        setShowSlackConfig(id);
      }
      return;
    }

    // If disabling, proceed with toggle
    else await toggleWebhook(id, field);
  };

  const contextValue = {
    webhooks,
    isLoading,
    isLoadingId,
    showEmailConfig,
    showSlackConfig,
    showDetails,
    setShowEmailConfig,
    setShowSlackConfig,
    setShowDetails,
    toggleWebhook,
    updateWebhookConfig,
  };

  return (
    <WebhookContext.Provider value={contextValue}>
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Create New Webhook</CardTitle>
            <CardDescription>
              Add a new webhook to your notification system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                placeholder='Enter webhook name'
                value={newWebhookName}
                onChange={e => setNewWebhookName(e.target.value)}
                className='flex-1'
              />
              <Button
                onClick={addWebhook}
                disabled={!newWebhookName || isLoading}
                className='whitespace-nowrap'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Adding...
                  </>
                ) : (
                  'Add Webhook'
                )}
              </Button>
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
            {isFetching ? (
              <div className='flex justify-center items-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : webhooks.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                No webhooks found. Add one to get started.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notifications</TableHead>
                      <TableHead className='w-[100px]'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map(webhook => (
                      <TableRow key={webhook.id}>
                        <TableCell className='pr-8'>
                          <div className='flex items-center flex-start gap-4'>
                            <span className='font-medium'>{webhook.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className='pr-8'>
                          <div className='flex items-center flex-start gap-4'>
                            <Switch
                              checked={webhook.is_active}
                              onCheckedChange={() =>
                                toggleWebhook(webhook.id, 'isActive')
                              }
                              disabled={isLoadingId === webhook.id}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-wrap items-center gap-6'>
                            <div className='flex items-center gap-2'>
                              <div className='flex items-center gap-1'>
                                <Mail className='h-4 w-4' />
                                <span className='text-sm'>Email</span>
                              </div>
                              <Switch
                                checked={webhook.notify_email}
                                onCheckedChange={() =>
                                  handleNotificationToggle(
                                    webhook.id,
                                    'notifyEmail',
                                  )
                                }
                                disabled={isLoadingId === webhook.id}
                              />
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='flex items-center gap-1'>
                                <Slack className='h-4 w-4' />
                                <span className='text-sm'>Slack</span>
                              </div>
                              <Switch
                                checked={webhook.notify_slack}
                                onCheckedChange={() =>
                                  handleNotificationToggle(
                                    webhook.id,
                                    'notifySlack',
                                  )
                                }
                                disabled={isLoadingId === webhook.id}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => setShowDetails(webhook.id)}
                              disabled={isLoadingId === webhook.id}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => deleteWebhook(webhook.id)}
                              disabled={isLoadingId === webhook.id}
                            >
                              {isLoadingId === webhook.id ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                              ) : (
                                <Trash2 className='h-4 w-4' />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {showDetails && (
          <Dialog
            open={showDetails !== null}
            onOpenChange={open => !open && setShowDetails(null)}
          >
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Webhook Configuration</DialogTitle>
              </DialogHeader>
              <ScrollArea className='h-[70vh] w-full '>
                <WebhookDetails
                  webhook={webhooks.find(w => w.id === showDetails)!}
                  onUpdate={(id, config) => updateWebhookConfig(id, config)}
                  isLoading={isLoadingId === showDetails}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}

        <EmailConfigDialog />

        <SlackConfigDialog />
      </div>
    </WebhookContext.Provider>
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
  const [name, setName] = useState(webhook.name);

  const { setShowEmailConfig, setShowSlackConfig } = useWebhook();
  const { copyToClipboard } = useClipboard();

  const handleNameUpdate = async () => {
    try {
      await onUpdate(webhook.id, { name });

      toast.success('Webhook name updated successfully');
    } catch (error) {
      toast.error('Error', { description: 'Failed to update webhook name' });
    }
  };

  return (
    <div className='grid gap-6 py-4'>
      <div className='grid gap-2'>
        <Label>Name</Label>
        <div className='flex gap-2'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Webhook name'
          />
          <Button
            onClick={handleNameUpdate}
            disabled={isLoading || name === webhook.name}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Save'}
          </Button>
        </div>
      </div>

      <div className='grid gap-2'>
        <Label>Webhook URL</Label>
        <div className='flex'>
          <Input
            value={`${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`}
            readOnly
            className='rounded-r-none font-mono text-sm'
          />
          <Button
            variant='secondary'
            className='rounded-l-none'
            onClick={() =>
              copyToClipboard(
                `${process.env.NEXT_PUBLIC_API_URL}${webhook.url}`,
              )
            }
          >
            <Clipboard className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid gap-2'>
        <Label>
          Secret{' '}
          <code className='ml-2 text-sm text-muted-foreground font-mono whitespace-nowrap bg-muted px-2 py-1 rounded-sm'>
            set in x-webhook-token header value
          </code>
        </Label>
        <div className='flex'>
          <Input
            type='text'
            value={webhook.secret}
            readOnly
            className='rounded-r-none font-mono text-sm'
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
      {/* <PlatformConfig
        webhook={webhook}
        onUpdate={onUpdate}
        isLoading={isLoading}
      /> */}
      <div className='grid gap-4'>
        <Label>Notification Settings</Label>
        <div className='space-y-4 p-4 border rounded-lg'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <span>Email Notifications</span>
              </div>
              <Switch
                checked={webhook.notify_email}
                onCheckedChange={() =>
                  onUpdate(webhook.id, { notify_email: !webhook.notify_email })
                }
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center gap-2'>
              {webhook.email_config && (
                <Badge variant='outline' className='text-xs'>
                  {webhook.email_config.recipient_email}
                </Badge>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEmailConfig(webhook.id)}
              >
                {webhook.email_config ? 'Edit' : 'Configure'}
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <Slack className='h-4 w-4' />
                <span>Slack Notifications</span>
              </div>
              <Switch
                checked={webhook.notify_slack}
                onCheckedChange={() =>
                  onUpdate(webhook.id, { notify_slack: !webhook.notify_slack })
                }
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center gap-2'>
              {webhook.slack_config && (
                <Badge variant='outline' className='text-xs'>
                  {webhook.slack_config.channel_name}
                </Badge>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowSlackConfig(webhook.id)}
              >
                {webhook.slack_config ? 'Edit' : 'Configure'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailConfigDialog() {
  const {
    webhooks,
    showEmailConfig,
    setShowEmailConfig,
    updateWebhookConfig,
    isLoadingId,
  } = useWebhook();
  const webhook = showEmailConfig
    ? webhooks.find(w => w.id === showEmailConfig)
    : null;

  return (
    <Dialog
      open={showEmailConfig !== null}
      onOpenChange={open => {
        if (!open) setShowEmailConfig(null);
      }}
    >
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Email Configuration</DialogTitle>
        </DialogHeader>
        {webhook && (
          <EmailConfig
            webhook={webhook}
            onUpdate={async config => {
              await updateWebhookConfig(showEmailConfig!, {
                notify_email: true,
                email_config: config.email_config,
              });
              setShowEmailConfig(null);
            }}
            onCancel={() => setShowEmailConfig(null)}
            isLoading={isLoadingId === showEmailConfig}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmailConfig({
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

  const isEmailConfigured = !!webhook.email_config?.recipient_email;

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

function SlackConfigDialog() {
  const {
    webhooks,
    showSlackConfig,
    setShowSlackConfig,
    toggleWebhook,
    updateWebhookConfig,
    isLoadingId,
  } = useWebhook();

  if (!showSlackConfig) return null;

  const webhook = webhooks.find(w => w.id === showSlackConfig);
  if (!webhook) return null;

  return (
    <Dialog
      open={showSlackConfig !== null}
      onOpenChange={open => {
        if (!open) {
          if (!webhook.slack_config) {
            toggleWebhook(webhook.id, 'notifySlack');
          }
          setShowSlackConfig(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
        </DialogHeader>
        <SlackConfig
          webhook={webhook}
          onUpdate={async config => {
            await updateWebhookConfig(showSlackConfig, {
              notify_slack: true,
              slack_config: config.slack_config,
            });
            setShowSlackConfig(null);
          }}
          onCancel={() => {
            if (!webhook.slack_config) {
              toggleWebhook(webhook.id, 'notifySlack');
            }
            setShowSlackConfig(null);
          }}
          isLoading={isLoadingId === showSlackConfig}
        />
      </DialogContent>
    </Dialog>
  );
}

function SlackConfig({
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
          <Label htmlFor='slackChannel'>Channel</Label>
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
        </div>
        <div className='grid w-full gap-2'>
          <Label htmlFor='slackTemplate'>Template</Label>
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
