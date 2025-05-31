'use client';

import { WebhookManagement } from '@/components/dashboard/WebhookManagement';
import { PlanLimitsDialog } from '../settings/usage/usage-settings';

export default function WebhooksPage() {
  return (
    <div className='container mx-auto p-4 md:p-6 space-y-6 '>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-zinc-200'>
            Welcome back
          </h1>
          <p className='text-sm md:text-base text-zinc-400'>
            Here's an overview of your webhook activity
          </p>
        </div>
        <PlanLimitsDialog text='Usage Limit' />
      </div>

      <WebhookManagement />
    </div>
  );
}
