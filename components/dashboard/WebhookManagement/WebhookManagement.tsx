'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
  Trash2,
  Slack,
  Mail,
  ArrowUpRight,
  Plug,
  Plus,
  Loader2,
} from 'lucide-react';
import { WebhookContext } from './WebhookContext';
import { EmailConfigDialog } from './EmailConfigDialog';
import { SlackConfigDialog } from './SlackConfigDialog';
import { Webhook } from './types';
import { WebhookDetails } from './WebhookDetails';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
import { QuickTemplates } from './QuickTemplates';
import { CreateWebhookDialog } from './CreateWebhookDialog';

const EmptyStateLoadingSkeleton = () => (
  <Card className='w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-6'>
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
      <div className='flex-1'>
        <Skeleton className='h-16 w-16 mb-4 bg-zinc-800' />
        <Skeleton className='h-6 w-48 mb-2 bg-zinc-800' />
        <Skeleton className='h-4 w-64 bg-zinc-800' />
      </div>
      <div className='flex-shrink-0'>
        <Skeleton className='h-10 w-48 bg-zinc-800' />
      </div>
    </div>
    <div className='mt-6'>
      <Skeleton className='h-3 w-32 mb-2 bg-zinc-800' />
      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-8 w-24 bg-zinc-800' />
        <Skeleton className='h-8 w-32 bg-zinc-800' />
        <Skeleton className='h-8 w-28 bg-zinc-800' />
      </div>
    </div>
  </Card>
);

const CreateWebhookLoadingSkeleton = () => (
  <Card className='w-full border border-zinc-700 bg-zinc-900/70 backdrop-blur-md rounded-2xl shadow-lg'>
    <CardHeader className='pb-4'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <Skeleton className='h-5 w-40 mb-2 bg-zinc-800' />
          <Skeleton className='h-4 w-64 bg-zinc-800' />
        </div>
        <Skeleton className='h-8 w-32 bg-zinc-800' />
      </div>
    </CardHeader>
    <CardContent className='pt-0'>
      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-8 w-24 bg-zinc-800' />
        <Skeleton className='h-8 w-32 bg-zinc-800' />
        <Skeleton className='h-8 w-28 bg-zinc-800' />
      </div>
    </CardContent>
  </Card>
);

const TableLoadingSkeleton = () => (
  <Card className='w-full border border-zinc-700 bg-zinc-900/70 backdrop-blur-md rounded-2xl shadow-lg'>
    <CardHeader className='pb-3'>
      <div className='flex justify-between items-center flex-wrap gap-2'>
        <div>
          <Skeleton className='h-5 w-36 mb-2 bg-zinc-800' />
          <Skeleton className='h-4 w-56 bg-zinc-800' />
        </div>
        <Skeleton className='h-7 w-20 bg-zinc-800' />
      </div>
    </CardHeader>
    <Separator className='mb-0' />
    <CardContent>
      <div className='mt-2'>
        <div className='space-y-4'>
          {/* Table header skeleton */}
          <div className='flex justify-between items-center pb-2 border-b border-zinc-800'>
            <Skeleton className='h-4 w-16 bg-zinc-800' />
            <Skeleton className='h-4 w-16 bg-zinc-800' />
            <Skeleton className='h-4 w-24 bg-zinc-800 hidden sm:block' />
            <Skeleton className='h-4 w-16 bg-zinc-800' />
          </div>
          {/* Table rows skeleton */}
          {[1, 2, 3].map(i => (
            <div key={i} className='flex justify-between items-center py-4'>
              <Skeleton className='h-4 w-32 bg-zinc-800' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-5 w-10 bg-zinc-800' />
                <Skeleton className='h-4 w-12 bg-zinc-800' />
              </div>
              <div className='hidden sm:flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4 bg-zinc-800' />
                  <Skeleton className='h-5 w-10 bg-zinc-800' />
                </div>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4 bg-zinc-800' />
                  <Skeleton className='h-5 w-10 bg-zinc-800' />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-9 w-20 bg-zinc-800' />
                <Skeleton className='h-9 w-9 bg-zinc-800' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingId, setIsLoadingId] = useState<string | null>(null);
  const [showEmailConfig, setShowEmailConfig] = useState<string | null>(null);
  const [showSlackConfig, setShowSlackConfig] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [initialWebhookName, setInitialWebhookName] = useState('');

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

      if (field === 'notifyEmail' && updates.notify_email) {
        setShowEmailConfig(id);
      }
      if (field === 'notifySlack' && updates.notify_slack) {
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

    if (isCurrentlyEnabled) {
      await toggleWebhook(id, field);
    } else {
      if (field === 'notifyEmail') {
        setShowEmailConfig(id);
      } else {
        setShowSlackConfig(id);
      }
    }
  };

  const handleTemplateSelect = (webhookName: string) => {
    setInitialWebhookName(webhookName);
    setShowCreateDialog(true);
  };

  const handleCreateClick = () => {
    setInitialWebhookName('');
    setShowCreateDialog(true);
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

  const hasWebhooks = webhooks.length > 0;

  if (isFetching) {
    return (
      <WebhookContext.Provider value={contextValue}>
        <div className='space-y-10 w-full max-w-6xl mx-auto'>
          {webhooks.length > 0 ? (
            <>
              <CreateWebhookLoadingSkeleton />
              <TableLoadingSkeleton />
            </>
          ) : (
            <EmptyStateLoadingSkeleton />
          )}
        </div>
      </WebhookContext.Provider>
    );
  }

  return (
    <WebhookContext.Provider value={contextValue}>
      <div className='space-y-10'>
        {/* Empty State - Only show when no webhooks exist */}
        {!hasWebhooks && (
          <Card className='w-full  rounded-2xl p-6 md:p-8 mb-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
              {/* Left content */}
              <div className='flex-1'>
                <div className='text-7xl font-black text-[#A692E5]'>*</div>
                <h3 className='text-xl font-semibold text-white'>
                  Let's get you started
                </h3>
                <p className='mt-1 text-sm text-zinc-400'>
                  Set up your first webhook in under 2 minutes.
                </p>
              </div>

              {/* CTA Button */}
              <div className='flex-shrink-0'>
                <Button
                  onClick={handleCreateClick}
                  className='inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md bg-gradient-to-tr from-[#A692E5] to-[#8169ff] text-white shadow hover:brightness-110 transition'
                >
                  Create Your First Webhook
                </Button>
              </div>
            </div>

            {/* Template Selector */}
            <div className='mt-6'>
              <p className='text-xs text-zinc-400 mb-2'>
                Or pick a quick template
              </p>
              <QuickTemplates onTemplateSelect={handleTemplateSelect} />
            </div>
          </Card>
        )}

        {/* Create New Webhook Section - Only show when webhooks exist */}
        {hasWebhooks && (
          <Card className='w-full border backdrop-blur-md rounded-2xl shadow-lg'>
            <CardHeader className='pb-4'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                {/* Text */}
                <div>
                  <CardTitle className='text-white text-lg font-semibold'>
                    Create New Webhook
                  </CardTitle>
                  <CardDescription className='text-sm text-zinc-400 mt-1'>
                    Add another webhook to your notification system.
                  </CardDescription>
                </div>

                {/* Button */}
                <Button
                  size='sm'
                  onClick={handleCreateClick}
                  className='flex items-center gap-2 text-sm font-medium py-1.5 px-3 rounded-md bg-gradient-to-tr from-[#A692E5] to-[#8169ff] text-white shadow hover:brightness-110 transition max-w-xs'
                >
                  <Plus className='h-4 w-4' />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>

            <CardContent className='pt-0'>
              <p className='text-sm text-zinc-300 mb-2'>
                or pick a quick template
              </p>
              <QuickTemplates onTemplateSelect={handleTemplateSelect} />
            </CardContent>
          </Card>
        )}

        {/* Manage Webhooks Section - Only show when we have webhooks */}
        {hasWebhooks && (
          <Card className='w-full border backdrop-blur-md rounded-2xl shadow-lg'>
            <CardHeader className='pb-3'>
              <div className='flex justify-between items-center flex-wrap gap-2'>
                <div>
                  <CardTitle className='text-white text-lg font-semibold'>
                    Manage Webhooks
                  </CardTitle>
                  <CardDescription className='text-sm text-zinc-400 mt-1'>
                    View and manage your existing webhooks
                  </CardDescription>
                </div>
                <Badge
                  variant='outline'
                  className='h-7 px-3 text-xs whitespace-nowrap bg-primary/10 text-primary border-primary/20'
                >
                  {webhooks.length} webhook
                  {webhooks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <Separator className='mb-0' />
            <CardContent className='p-0 '>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent border-none '>
                    <TableHead className='w-[25%] min-w-[180px] px-6 py-4'>
                      Name
                    </TableHead>
                    <TableHead className='w-[20%] min-w-[120px] px-4 py-4'>
                      Status
                    </TableHead>
                    <TableHead className='w-[35%] min-w-[180px] px-4 py-4'>
                      Notifications
                    </TableHead>
                    <TableHead className='w-[20%] min-w-[120px] text-right px-6 py-4'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook, index) => (
                    <TableRow
                      key={webhook.id}
                      className={`hover:bg-zinc-800/20 transition-colors ${
                        index === webhooks.length - 1
                          ? 'border-none'
                          : 'border-zinc-800/50'
                      }`}
                    >
                      <TableCell className='px-6'>
                        <div className='flex items-center gap-2'>
                          <a
                            href={`/dashboard/webhooks/${webhook.id}`}
                            className='text-foreground hover:text-primary hover:underline flex items-center gap-1 transition-all font-medium'
                          >
                            <span className=' max-w-[180px] text-wrap sm:truncate'>
                              {webhook.name}
                            </span>
                            <ArrowUpRight className='h-4 w-4 text-primary flex-shrink-0' />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className='px-4 py-4'>
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
                            className={`text-sm whitespace-nowrap ${
                              webhook.is_active
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {webhook.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='px-4 py-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6'>
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
                              className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-input'
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-right px-6 py-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setShowDetails(webhook.id)}
                            disabled={isLoadingId === webhook.id}
                            className='h-9 px-3 border-border/60 hover:bg-muted flex-shrink-0'
                          >
                            <Plug className='h-4 w-4' />
                            <span className='hidden lg:inline'>Connect</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='icon'
                                disabled={isLoadingId === webhook.id}
                                className='h-9 w-9 border-border/60 hover:bg-muted hover:text-destructive flex-shrink-0'
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
                                <AlertDialogTitle className='text-destructive font-medium text-left'>
                                  Delete Webhook
                                </AlertDialogTitle>
                                <AlertDialogDescription className='text-muted-foreground text-left'>
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
            </CardContent>
          </Card>
        )}

        {/* Create Webhook Dialog */}
        <CreateWebhookDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onWebhookCreated={fetchWebhooks}
          initialName={initialWebhookName}
        />

        {/* Webhook Details Dialog */}
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
