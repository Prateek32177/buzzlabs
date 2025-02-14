import { WebhookManagement } from '@/components/dashboard/WebhookManagement';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Bell, BarChart } from 'lucide-react';

export default function WebhooksPage() {
  return (
    <div className='space-y-6 m-10'>
      <DataPoints />
      <WebhookManagement />
    </div>
  );
}

export function DataPoints() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
        <p className='text-zinc-400'>
          Here's an overview of your webhook activity
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='glass'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              Total Webhooks
            </CardTitle>
            <CalendarDays className='w-4 h-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2,543</div>
            <div className='flex items-center space-x-2 mt-1'>
              <Badge className='bg-emerald-500/10 text-emerald-500'>+10%</Badge>
              <p className='text-xs text-zinc-400'>From last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className='glass'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <Users className='w-4 h-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>573</div>
            <div className='flex items-center space-x-2 mt-1'>
              <Badge className='bg-emerald-500/10 text-emerald-500'>+12%</Badge>
              <p className='text-xs text-zinc-400'>From last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className='glass'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>Notifications</CardTitle>
            <Bell className='w-4 h-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>48.2k</div>
            <div className='flex items-center space-x-2 mt-1'>
              <Badge className='bg-emerald-500/10 text-emerald-500'>+8%</Badge>
              <p className='text-xs text-zinc-400'>From last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className='glass'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>Success Rate</CardTitle>
            <BarChart className='w-4 h-4 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>99.8%</div>
            <div className='flex items-center space-x-2 mt-1'>
              <Badge className='bg-emerald-500/10 text-emerald-500'>+2%</Badge>
              <p className='text-xs text-zinc-400'>From last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4 glass">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Your webhook activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3 glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest webhook events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div> */}
    </div>
  );
}
