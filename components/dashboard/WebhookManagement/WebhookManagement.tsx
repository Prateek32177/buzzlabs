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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Eye,
  Trash2,
  Slack,
  Mail,
  Loader2,
  ArrowUpRight,
  PlugZap,
} from 'lucide-react';
import { WebhookContext } from './WebhookContext';
import { EmailConfigDialog } from './EmailConfigDialog';
import { SlackConfigDialog } from './SlackConfigDialog';
import { Webhook } from './types';
import { WebhookDetails } from './WebhookDetails';

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
      if (!response.ok) throw new Error(`Failed to fetch webhooks`);
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
        await fetchWebhooks();
        toast.success('Webhook Created', {
          description: `New webhook ${newWebhookName} has been created.`,
        });
      } catch (error) {
        toast.error('Error', {
          description:
            error instanceof Error ? error.message : 'Failed to create webhook',
        });
      } finally {
        setIsLoading(false);
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

    const isCurrentlyEnabled =
      field === 'notifyEmail' ? webhook.notify_email : webhook.notify_slack;

    // If already enabled and trying to disable, proceed with toggle
    if (isCurrentlyEnabled) {
      await toggleWebhook(id, field);
    }
    // If disabled and trying to enable, show config first
    else {
      if (field === 'notifyEmail') {
        setShowEmailConfig(id);
      } else {
        setShowSlackConfig(id);
      }
    }
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
                      <TableHead>Active</TableHead>
                      <TableHead>Notifications</TableHead>
                      <TableHead className='w-[100px]'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map(webhook => (
                      <TableRow key={webhook.id}>
                        <TableCell className='pr-8'>
                          <div className='flex items-center flex-start gap-2 justify-start'>
                            <a
                              href={`/dashboard/webhooks/${webhook.id}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-gray-300 hover:text-gray-100 hover:underline flex items-center gap-1.5 opacity-100 hover:opacity-80 transition-all'
                            >
                              {webhook.name}
                            </a>
                            <span>
                              <ArrowUpRight className='h-3.5 w-3.5' />
                            </span>
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
                              <div className='flex items-center gap-1 text-gray-300'>
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
                              <div className='flex items-center gap-1 text-gray-300'>
                                <Slack className='h-4 w-4' />
                                <span className='text-sm '>Slack</span>
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
                              size='sm'
                              onClick={() => setShowDetails(webhook.id)}
                              disabled={isLoadingId === webhook.id}
                            >
                                    <span>
                                {' '}
                                <PlugZap className='h-8 w-8 ' />
                              </span>
                              <span className='md:flex hidden'>connect</span>
                        
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
          <WebhookDetails
            webhook={webhooks.find(w => w.id === showDetails)!}
            onUpdate={(id, config) => updateWebhookConfig(id, config)}
            isLoading={isLoadingId === showDetails}
            open={showDetails !== null}
            onOpenChange={open => !open && setShowDetails(null)}
          />
        )}

        <EmailConfigDialog />

        <SlackConfigDialog />
      </div>
    </WebhookContext.Provider>
  );
}
