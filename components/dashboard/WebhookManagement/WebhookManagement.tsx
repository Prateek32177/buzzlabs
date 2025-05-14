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
  ArrowUpRight,
  Plug,
  PlugZap,
  Anchor,
  Plus,
  Loader2,
} from 'lucide-react';
import { WebhookContext } from './WebhookContext';
import { EmailConfigDialog } from './EmailConfigDialog';
import { SlackConfigDialog } from './SlackConfigDialog';
import { Webhook } from './types';
import { WebhookDetails } from './WebhookDetails';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
    setIsLoadingId(id);
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
    } finally {
      setIsLoadingId(null);
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
        <Card className='border border-border/40 shadow-sm'>
          <CardHeader>
            <CardTitle>Create New Webhook</CardTitle>
            <CardDescription>
              Add a new webhook to your notification system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (newWebhookName.length >= 3) {
                  addWebhook();
                } else {
                  toast.error('Validation Error', {
                    description:
                      'Webhook name must be at least 3 characters long',
                  });
                }
                }}
                className='flex flex-col sm:flex-row gap-4'
              >
                <div className="flex-1 flex items-center relative">
                  <Anchor strokeWidth={1.5} 
                  className={`h-4 w-4 absolute left-3 text-muted-foreground transition-all duration-300 ${
                  newWebhookName ? 'text-primary' : ''
                  }`}
                  style={{
                  transform: newWebhookName ? 'translateY(-1px) rotate(5deg)' : 'none',
                  filter: newWebhookName ? 'drop-shadow(0 0 2px rgb(var(--primary)))' : 'none'
                  }}
                  />
                  <Input
                  placeholder='Add webhook name'
                  value={newWebhookName}
                  onChange={e => setNewWebhookName(e.target.value)}
                  className={`flex-1 border border-border/70 pl-9 placeholder:text-sm transition-all duration-300 ${
                    newWebhookName ? 'shadow-[0_0_0_1px] shadow-primary/20 border-primary/40' : ''
                  }`}
                  required
                  minLength={3}
                  />
                </div>
              <Button
                type='submit'
                variant='default'
                className='whitespace-nowrap'
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <>
                    <Plus className='h-4 w-4' />
                    <span>Create Webhook</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className='border border-border/40 shadow-sm'>
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-center flex-wrap gap-2 '>
              <div>
                <CardTitle className='text-xl font-semibold'>
                  Manage Webhooks
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  View and manage your existing webhooks.
                </CardDescription>
              </div>
              {webhooks.length > 0 && (
                <Badge
                  variant='outline'
                  className='h-7 px-3 text-xs whitespace-nowrap'
                >
                  {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <Separator className='mb-0' />
          <CardContent>
            {isFetching ? (
              <div className='flex justify-center items-center py-12'>
                <div className='flex flex-col items-center gap-2'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
                  <span className='text-sm text-muted-foreground'>
                    Loading webhooks...
                  </span>
                </div>
              </div>
            ) : webhooks.length === 0 ? (
              <div className='text-center py-16 px-4'>
                <div className='flex flex-col items-center gap-3'>
                  <PlugZap className='h-12 w-12 text-muted-foreground/50' />
                  <div>
                    <p className='font-medium text-foreground'>
                      No webhooks found
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Create a new webhook to get started
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='relative overflow-x-auto mt-2'>
                <Table>
                  <TableHeader>
                    <TableRow className='hover:bg-transparent border-none'>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notifications</TableHead>
                      <TableHead className='text-right w-[120px]'>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook, index) => (
                      <TableRow
                        key={webhook.id}
                        className={`hover:bg-transparent ${index === webhooks.length - 1 ? 'border-none' : ''}`}
                      >
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <a
                              href={`/dashboard/webhooks/${webhook.id}`}
                              className='text-gray-200 hover:text-gray-100 hover:underline flex items-center gap-1.5 opacity-100 hover:opacity-80 transition-all'
                            >
                              {webhook.name}

                              <span>
                                <ArrowUpRight className='h-3.5 w-3.5' />
                              </span>
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className='py-4'>
                          <div className='flex items-center gap-3'>
                            <Switch
                              checked={webhook.is_active}
                              onCheckedChange={() =>
                                toggleWebhook(webhook.id, 'isActive')
                              }
                              disabled={isLoadingId === webhook.id}
                              className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
                            />
                            <span
                              className={`text-sm ${webhook.is_active ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                              {webhook.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='py-4'>
                          <div className='flex flex-wrap items-center gap-6'>
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center gap-1.5'>
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
                                className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
                              />
                            </div>
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center gap-1.5'>
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
                                className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-right py-4'>
                          <div className='flex items-center justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setShowDetails(webhook.id)}
                              disabled={isLoadingId === webhook.id}
                              className='h-9 px-3 border-border/60 hover:bg-muted'
                            >
                              <Plug className='h-4 w-4' />
                              <span className='sm:inline hidden'>Connect</span>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  disabled={isLoadingId === webhook.id}
                                  className='h-9 w-9 border-border/60 hover:bg-muted hover:text-destructive'
                                >
                                  {isLoadingId === webhook.id ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                  ) : (
                                    <Trash2 className='h-4 w-4' />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className='border border-border/80'>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className='text-destructive font-medium'>
                                    Delete Webhook
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className='text-muted-foreground'>
                                    This action cannot be undone. All webhook
                                    details and associated logs will be
                                    permanently deleted.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className='border-border/60'>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteWebhook(webhook.id)}
                                    disabled={isLoadingId === webhook.id}
                                    className='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                                  >
                                    {isLoadingId === webhook.id ? (
                                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                    ) : (
                                      <Trash2 className='h-4 w-4 mr-2' />
                                    )}
                                    Delete Webhook
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
            onUpdate={async (id, config) => {
              await updateWebhookConfig(id, config);
              await fetchWebhooks();
            }}
            isLoading={isLoadingId === showDetails}
            open={showDetails !== null}
            onOpenChange={async open => {
              if (open) {
                await fetchWebhooks();
              }
              if (!open) {
                setShowDetails(null);
              }
            }}
          />
        )}

        <EmailConfigDialog />

        <SlackConfigDialog />
      </div>
    </WebhookContext.Provider>
  );
}
