import { WebhookManagement } from '@/components/dashboard/WebhookManagement';
export default function WebhooksPage() {
  return (
    <div className='space-y-6 mx-10'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
        <p className='text-zinc-400'>
          Here's an overview of your webhook activity
        </p>
      </div>
      <WebhookManagement />
    </div>
  );
}
