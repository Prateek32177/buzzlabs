import { WebhookManagement } from '@/components/dashboard/WebhookManagement';
import { PlanLimitsDialog } from '../settings/usage/usage-settings';

export default function WebhooksPage() {
  return (
    <div className='space-y-6 px-4 md:px-10 max-w-full'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
          <p className='text-zinc-400'>
            Here's an overview of your webhook activity
          </p>
        </div>
        <PlanLimitsDialog text='Usage Limit' />
      </div>
      <WebhookManagement />
    </div>
  );
}
