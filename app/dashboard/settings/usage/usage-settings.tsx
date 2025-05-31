'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Slack,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  HelpCircle,
  BarChart3,
  Activity,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useUsageData } from '@/hooks/use-usage-data';
import { formatBytes } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { UsageChart } from './usagechart';
import { Button } from '@/components/ui/button';

// Define types to avoid type errors
interface UsageMetricProps {
  label: string;
  current: number | string;
  max: number | string;
  percentage: number;
  icon?: React.ReactNode;
  description?: string;
}

interface WebhookTrendProps {
  data: Array<{ name: string; value: number }>;
}

const UsageTab = () => {
  const { usageData, isLoading, error, limitMessages, hasReachedAnyLimit } =
    useUsageData();
  const [isDialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!usageData) return null;

  const { subscription, currentUsage, chartData } = usageData;
  const tierName =
    subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1);

  return (
    <Card className='space-y-8 p-6  glass-card rounded-lg  h-full mt-6 mb-16 animate-in fade-in duration-500'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-semibold text-white'>Track Usage</h2>
          <p className='text-sm text-white/70 mt-1'>
            Monitor your resource consumption and limits
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <Badge
            variant='outline'
            className='text-xs font-medium border-white/10 bg-secondary text-white px-3 py-1'
          >
            {tierName} Plan
          </Badge>
          <PlanLimitsDialog />
        </div>
      </div>

      {/* Warning Banner */}
      {hasReachedAnyLimit && (
        <div className='flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg shadow-sm'>
          <AlertTriangle className='h-5 w-5 text-destructive flex-shrink-0' />
          <span className='text-white text-sm font-medium'>
            {limitMessages}
          </span>
        </div>
      )}
      {/* Main Usage Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <UsageMetric
          label='Number of Webhooks'
          current={currentUsage.webhooks.current}
          max={subscription.limits.webhookLimit}
          percentage={currentUsage.webhooks.percentage}
          icon={<BarChart3 className='h-5 w-5 text-white/80' />}
          description='Total active webhooks in your account'
        />

        <UsageMetric
          label='Daily Requests'
          current={currentUsage.requests.current}
          max={subscription.limits.dailyRequests}
          percentage={currentUsage.requests.percentage}
          icon={<Activity className='h-5 w-5 text-white/80' />}
          description='API requests processed today'
        />

        <UsageMetric
          label='Payload Volume'
          current={formatBytes(currentUsage.dataVolume.current)}
          max={`${subscription.limits.dailyDataVolumeMB} MB`}
          percentage={currentUsage.dataVolume.percentage}
          icon={<Database className='h-5 w-5 text-white/80' />}
          description='Total data processed today'
        />
      </div>

      {/* Notification Metrics */}
      <div className='space-y-6'>
        <h3 className='text-xl font-semibold text-white'>Notifications</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Email Notifications */}
          <NotificationMetricCard
            title='Email Notifications'
            icon={<Mail className='h-4 w-4 text-white/80' />}
            tooltipText='Email notification usage and limits'
            metrics={[
              {
                label: 'Daily Usage',
                current: currentUsage.dailyEmails.current,
                max: subscription.limits.dailyEmails,
                percentage: currentUsage.dailyEmails.percentage,
              },
              {
                label: 'Monthly Usage',
                current: currentUsage.monthlyEmails.current,
                max: subscription.limits.emailNotificationLimit,
                percentage:
                  (currentUsage.monthlyEmails.current /
                    subscription.limits.emailNotificationLimit) *
                  100,
              },
            ]}
          />

          {/* Slack Notifications */}
          <NotificationMetricCard
            title='Slack Notifications'
            icon={<Slack className='h-4 w-4 text-white/80' />}
            tooltipText='Slack notification usage and limits'
            metrics={[
              {
                label: 'Daily Usage',
                current: currentUsage.dailySlackNotifications.current,
                max: subscription.limits.dailySlackNotifications,
                percentage: currentUsage.dailySlackNotifications.percentage,
              },
              {
                label: 'Monthly Usage',
                current: currentUsage.monthlySlackNotifications.current,
                max: subscription.limits.slackNotificationLimit,
                percentage:
                  (currentUsage.monthlySlackNotifications.current /
                    subscription.limits.slackNotificationLimit) *
                  100,
              },
            ]}
          />
        </div>
      </div>

      {/* Usage Charts */}
      <div className='space-y-6'>
        <h3 className='text-xl font-semibold text-white'>Usage Trends</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Notification Trends Chart */}
          <Card className='border-white/10 shadow-sm'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium'>
                  Notification Activity
                </CardTitle>
                <div className='flex items-center gap-4 text-xs'>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2.5 h-2.5 rounded-full bg-[hsl(var(--sidebar-ring))]'></div>
                    <span className='text-white/70'>Email</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2.5 h-2.5 rounded-full bg-[hsl(var(--chart-2))]'></div>
                    <span className='text-white/70'>Slack</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className='pt-0'>
              <div className='h-[300px] w-full'>
                <UsageChart
                  data={chartData.emailSlack}
                  dataKeys={['Email', 'Slack']}
                  colors={['hsl(var(--sidebar-ring))', 'hsl(var(--chart-2))']}
                  showGrid={true}
                  tooltipFormatter={value => `${value} notifications`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Webhook Usage Chart */}
          <Card className='border-white/10 shadow-sm'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium'>
                  Webhook Usage
                </CardTitle>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2.5 h-2.5 rounded-full bg-[hsl(var(--chart-1))]'></div>
                  <span className='text-xs text-white/70'>Requests</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className='pt-0'>
              <div className='h-[300px] w-full'>
                <UsageChart
                  data={chartData.webhooks}
                  dataKeys={['value']}
                  colors={['hsl(var(--chart-1))']}
                  showGrid={true}
                  tooltipFormatter={value => `${value} requests`}
                  nameKey='name'
                  valueKey='value'
                />
              </div>

              {chartData.webhooks.length > 1 && (
                <WebhookTrend data={chartData.webhooks} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
};

// Usage Metric Component - Card style
const UsageMetric = ({
  label,
  current,
  max,
  percentage,
  icon,
  description,
}: UsageMetricProps) => {
  const getStatusColor = (percent: number) => {
    if (percent > 90) return 'text-rose-300';
    if (percent > 75) return 'text-amber-200';
    if (percent > 50) return 'text-white/70';
    return 'text-white/70';
  };

  const getProgressColor = (percent: number) => {
    if (percent > 90) return 'bg-rose-300/70';
    if (percent > 75) return 'bg-amber-200/70';
    return 'bg-emerald-300/70';
  };

  const getStatusText = (percent: number) => {
    if (percent > 90) return 'Critical - Near limit';
    if (percent > 75) return 'Warning - High usage';
    if (percent > 50) return 'Moderate usage';
    return 'Good standing';
  };

  return (
    <Card className='border-white/10 shadow-sm hover:shadow-md transition-all duration-300'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-full bg-secondary/80 transition-transform duration-300'>
              {icon}
            </div>
            <h4 className='text-base font-medium text-white'>{label}</h4>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-white/70 hover:text-white hover:bg-secondary/80'
                >
                  <Info className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className='mt-2 mb-4'>
          <div className='flex justify-between text-sm text-white/70 mb-2'>
            <span>Used</span>
            <span className='font-medium'>
              {current} of {max}
            </span>
          </div>
          <div className='h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden'>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-in-out',
                getProgressColor(percentage),
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div
          className={`text-sm ${getStatusColor(percentage)} flex items-center gap-1.5 mt-3`}
        >
          <div className='w-2 h-2 rounded-full bg-current'></div>
          <span>{getStatusText(percentage)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Webhook Trend Component
const WebhookTrend = ({ data }: WebhookTrendProps) => {
  if (data.length < 2) return null;

  const lastIndex = data.length - 1;
  const currentMonth = data[lastIndex].value;
  const previousMonth = data[lastIndex - 1].value;

  const percentageChange =
    previousMonth === 0
      ? 100
      : (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1);

  const isUp = currentMonth >= previousMonth;

  return (
    <div className='mt-4 text-sm flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-white/5'>
      {isUp ? (
        <TrendingUp className='h-4 w-4 text-[hsl(var(--chart-2))]' />
      ) : (
        <TrendingDown className='h-4 w-4 text-destructive' />
      )}
      <span
        className={isUp ? 'text-[hsl(var(--chart-2))]' : 'text-destructive'}
      >
        {isUp ? 'Up' : 'Down'} {Math.abs(Number(percentageChange))}% from
        previous period
      </span>
    </div>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className='space-y-8'>
    {/* Header Skeleton */}
    <div className='flex justify-between items-center overflow-hidden'>
      <div className='space-y-2 overflow-hidden'>
        <Skeleton className='h-8 w-48 bg-secondary/50' />
        <Skeleton className='h-4 w-64 bg-secondary/50' />
      </div>
      <Skeleton className='h-8 w-32 bg-secondary/50 rounded-full' />
    </div>

    {/* Usage Metrics Skeleton */}
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {[...Array(3)].map((_, i) => (
        <Card key={i} className='border-white/10 shadow-sm'>
          <CardContent className='p-6'>
            <div className='flex justify-between items-start mb-6 overflow-hidden'>
              <div className='flex items-center gap-3 overflow-hidden'>
                <Skeleton className='h-10 w-10 rounded-full bg-secondary/50' />
                <Skeleton className='h-5 w-24 bg-secondary/50' />
              </div>
              <Skeleton className='h-8 w-8 rounded-full bg-secondary/50' />
            </div>
            <div className='space-y-4 overflow-hidden'>
              <div className='flex justify-between mb-2 overflow-hidden'>
                <Skeleton className='h-4 w-16 bg-secondary/50' />
                <Skeleton className='h-4 w-24 bg-secondary/50' />
              </div>
              <Skeleton className='h-2.5 w-full bg-secondary/50 rounded-full' />
              <Skeleton className='h-5 w-32 bg-secondary/50' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Notifications Section Header */}
    <div className='space-y-4 overflow-hidden'>
      <Skeleton className='h-7 w-40 bg-secondary/50' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className='border-white/10 shadow-sm'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between overflow-hidden'>
                <div className='flex items-center gap-3 overflow-hidden'>
                  <Skeleton className='h-8 w-8 rounded-full bg-secondary/50' />
                  <Skeleton className='h-5 w-32 bg-secondary/50' />
                </div>
                <Skeleton className='h-8 w-8 rounded-full bg-secondary/50' />
              </div>
            </CardHeader>
            <CardContent className='space-y-6 pt-2'>
              {[...Array(2)].map((_, j) => (
                <div key={j} className='space-y-3 overflow-hidden'>
                  <div className='flex justify-between overflow-hidden'>
                    <Skeleton className='h-4 w-20 bg-secondary/50' />
                    <Skeleton className='h-4 w-28 bg-secondary/50' />
                  </div>
                  <Skeleton className='h-2.5 w-full bg-secondary/50 rounded-full' />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    {/* Charts Section */}
    <div className='space-y-4 overflow-hidden'>
      <Skeleton className='h-7 w-40 bg-secondary/50' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className='border-white/10 shadow-sm'>
            <CardHeader className='pb-2'>
              <div className='flex justify-between items-center overflow-hidden'>
                <Skeleton className='h-5 w-40 bg-secondary/50' />
                <div className='flex gap-4 overflow-hidden'>
                  <Skeleton className='h-4 w-20 bg-secondary/50' />
                  <Skeleton className='h-4 w-20 bg-secondary/50' />
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-0 overflow-hidden'>
              <Skeleton className='h-[300px] w-full bg-secondary/50 rounded-lg' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error }: { error: string }) => (
  <Card className='p-8 border-destructive/20 shadow-md'>
    <div className='flex flex-col items-center justify-center h-48 text-center'>
      <AlertTriangle className='h-12 w-12 text-destructive mb-4' />
      <h3 className='text-xl font-medium text-white mb-2'>
        Failed to load usage data
      </h3>
      <p className='text-sm text-white/70 mb-6'>{error}</p>
      <Button onClick={() => window.location.reload()} variant='secondary'>
        <RefreshCw className='mr-2 h-4 w-4' /> Try Again
      </Button>
    </div>
  </Card>
);

export default UsageTab;

const NotificationMetricCard = ({
  title,
  icon,
  tooltipText,
  metrics,
}: {
  title: string;
  icon: React.ReactNode;
  tooltipText: string;
  metrics: Array<{
    label: string;
    current: number;
    max: number;
    percentage: number;
  }>;
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-200';
    if (percentage > 75) return 'bg-amber-200';
    return 'bg-emerald-200';
  };

  return (
    <Card className='border-white/10 shadow-sm'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='p-2 rounded-full bg-secondary'>{icon}</div>
            <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-white/70 hover:text-white hover:bg-secondary'
                >
                  <Info className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className='space-y-5 pt-2'>
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className='flex justify-between text-xs text-white/70 mb-2'>
              <span>{metric.label}</span>
              <span className='font-medium'>
                {metric.current} of {metric.max}
              </span>
            </div>
            <div className='h-2 w-full bg-secondary rounded-full overflow-hidden'>
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-in-out opacity-80',
                  getProgressColor(metric.percentage),
                )}
                style={{
                  width: `${Math.min(metric.percentage, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export function PlanLimitsDialog({
  text,
  showIcon = true,
}: {
  text?: string;
  showIcon?: boolean;
}) {
  const { usageData } = useUsageData();
  const [isOpen, setIsOpen] = useState(false);

  if (!usageData) return null;

  const { subscription } = usageData;
  const tierName =
    subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size={text ? 'sm' : 'icon'}
          className='text-white/70 hover:text-white hover:bg-secondary'
        >
          {text && <span>{text}</span>}
          {showIcon && <HelpCircle className={`w-4 h-4`} />}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xs  sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Plan Limits</DialogTitle>
          <DialogDescription>
            Your current usage limits based on the {tierName} plan.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          {/* Notification Limits Table */}
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-white/80 mb-3'>
              Notification Limits
            </h4>
            <table className='w-full'>
              <tbody>
                <tr>
                  <td className='py-1 text-sm text-white/60'>Daily Emails</td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.dailyEmails}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className='py-1 text-sm text-white/60'>Daily Slack</td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.dailySlackNotifications}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className='py-1 text-sm text-white/60'>Monthly Emails</td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.emailNotificationLimit}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className='py-1 text-sm text-white/60'>Monthly Slack</td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.slackNotificationLimit}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className='py-1 text-sm text-white/60'>
                    Max Request per second
                  </td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>2</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Resource Limits Table */}
          <div>
            <h4 className='text-sm font-medium text-white/80 mb-3'>
              Resource Limits
            </h4>
            <table className='w-full'>
              <tbody>
                <tr>
                  <td className='py-1 text-sm text-white/60'>
                    Number of Webhooks
                  </td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.webhookLimit}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className='py-1 text-sm text-white/60'>Daily Requests</td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.dailyRequests}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className='py-1 text-sm text-white/60'>Daily Volume</td>
                  <td className='py-1 text-right'>
                    <Badge variant='secondary'>
                      {subscription.limits.dailyDataVolumeMB} MB
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
