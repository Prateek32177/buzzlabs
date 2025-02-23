import { WebhookManagement } from '@/components/dashboard/WebhookManagement';
import { DataPoints } from './DataPoints';

export default function WebhooksPage() {
  return (
    <div className='space-y-6 mx-10'>
      <DataPoints />
      <WebhookManagement />
    </div>
  );
}
