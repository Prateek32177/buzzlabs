'use client';

import type React from 'react';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Mail,
  Slack,
  Clock,
  TrendingUp,
  AlertTriangle,
  Info,
  HelpCircle,
  BarChart3,
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
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

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
    <div className='space-y-8 mb-16'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h2 className='text-xl font-medium text-white'>Usage</h2>
          <p className='text-sm text-zinc-400 mt-1'>
            Monitor your resource consumption and limits
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge
            variant='outline'
            className='text-xs font-normal border-zinc-700 bg-zinc-900'
          >
            {tierName} Plan
          </Badge>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className='text-xs text-zinc-400 hover:text-white'>
                <HelpCircle className='w-4 h-4' />
              </button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Plan Limits</DialogTitle>
                <DialogDescription>
                  Your current usage limits based on the {tierName} plan.
                </DialogDescription>
              </DialogHeader>
              <div className='grid grid-cols-2 gap-4 py-4'>
                <div className='space-y-1'>
                  <h4 className='text-sm font-medium text-zinc-200'>
                    Resources
                  </h4>
                  <p className='text-sm text-zinc-400'>
                    Webhooks: {subscription.limits.webhookLimit}
                  </p>
                  <p className='text-sm text-zinc-400'>
                    Daily Requests: {subscription.limits.dailyRequests}
                  </p>
                  <p className='text-sm text-zinc-400'>
                    Data Volume: {subscription.limits.dailyDataVolumeMB} MB
                  </p>
                </div>
                <div className='space-y-1'>
                  <h4 className='text-sm font-medium text-zinc-200'>
                    Notifications
                  </h4>
                  <p className='text-sm text-zinc-400'>
                    Daily Emails: {subscription.limits.dailyEmails}
                  </p>
                  <p className='text-sm text-zinc-400'>
                    Daily Slack: {subscription.limits.dailySlackNotifications}
                  </p>
                  <p className='text-sm text-zinc-400'>
                    Monthly Email: {subscription.limits.emailNotificationLimit}
                  </p>
                  <p className='text-sm text-zinc-400'>
                    Monthly Slack: {subscription.limits.slackNotificationLimit}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Warning Banner */}
      {hasReachedAnyLimit && (
        <div className='flex items-center gap-2 p-3 bg-amber-950/20 border border-amber-900/30 rounded-md'>
          <AlertTriangle className='h-4 w-4 text-amber-500 flex-shrink-0' />
          <span className='text-amber-200 text-sm'>{limitMessages}</span>
        </div>
      )}

      {/* Reset Time */}
      <div className='text-sm flex items-center text-zinc-400 -mt-4'>
        <Clock className='h-4 w-4 mr-1.5' />
        Daily limits reset at midnight IST
      </div>

      {/* Main Usage Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <UsageMetric
          label='Webhooks'
          current={currentUsage.webhooks.current}
          max={subscription.limits.webhookLimit}
          percentage={currentUsage.webhooks.percentage}
          icon={<BarChart3 className='h-4 w-4 text-zinc-400' />}
          description='Total active webhooks'
        />

        <UsageMetric
          label='Daily Requests'
          current={currentUsage.requests.current}
          max={subscription.limits.dailyRequests}
          percentage={currentUsage.requests.percentage}
          icon={<Activity className='h-4 w-4 text-zinc-400' />}
          description='API requests today'
        />

        <UsageMetric
          label='Data Volume'
          current={formatBytes(currentUsage.dataVolume.current)}
          max={`${subscription.limits.dailyDataVolumeMB} MB`}
          percentage={currentUsage.dataVolume.percentage}
          icon={<Database className='h-4 w-4 text-zinc-400' />}
          description='Data processed today'
        />
      </div>

      {/* Notification Metrics */}
      <div className='space-y-6'>
        <h3 className='text-lg font-medium text-white'>Notifications</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Email Notifications */}
          <Card className='p-5 border-zinc-800 bg-zinc-950/50'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-zinc-400' />
                <h4 className='text-sm font-medium text-white'>Email</h4>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className='text-zinc-500 hover:text-zinc-400'>
                      <Info className='h-4 w-4' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs'>
                      Email notification usage and limits
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='space-y-5'>
              <div>
                <div className='flex justify-between text-xs text-zinc-400 mb-1.5'>
                  <span>Daily</span>
                  <span>
                    {currentUsage.dailyEmails.current} of{' '}
                    {subscription.limits.dailyEmails}
                  </span>
                </div>
                <div className='h-1 w-full bg-zinc-800 rounded-full'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      currentUsage.dailyEmails.percentage > 90
                        ? 'bg-red-500'
                        : currentUsage.dailyEmails.percentage > 75
                          ? 'bg-amber-500'
                          : 'bg-zinc-400',
                    )}
                    style={{
                      width: `${Math.min(currentUsage.dailyEmails.percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className='flex justify-between text-xs text-zinc-400 mb-1.5'>
                  <span>Monthly</span>
                  <span>
                    {currentUsage.monthlyEmails.current} of{' '}
                    {subscription.limits.emailNotificationLimit}
                  </span>
                </div>
                <div className='h-1 w-full bg-zinc-800 rounded-full'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      (currentUsage.monthlyEmails.current /
                        subscription.limits.emailNotificationLimit) *
                        100 >
                        90
                        ? 'bg-red-500'
                        : (currentUsage.monthlyEmails.current /
                              subscription.limits.emailNotificationLimit) *
                              100 >
                            75
                          ? 'bg-amber-500'
                          : 'bg-zinc-400',
                    )}
                    style={{
                      width: `${Math.min((currentUsage.monthlyEmails.current / subscription.limits.emailNotificationLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Slack Notifications */}
          <Card className='p-5 border-zinc-800 bg-zinc-950/50'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Slack className='h-4 w-4 text-zinc-400' />
                <h4 className='text-sm font-medium text-white'>Slack</h4>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className='text-zinc-500 hover:text-zinc-400'>
                      <Info className='h-4 w-4' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='text-xs'>
                      Slack notification usage and limits
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='space-y-5'>
              <div>
                <div className='flex justify-between text-xs text-zinc-400 mb-1.5'>
                  <span>Daily</span>
                  <span>
                    {currentUsage.dailySlackNotifications.current} of{' '}
                    {subscription.limits.dailySlackNotifications}
                  </span>
                </div>
                <div className='h-1 w-full bg-zinc-800 rounded-full'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      currentUsage.dailySlackNotifications.percentage > 90
                        ? 'bg-red-500'
                        : currentUsage.dailySlackNotifications.percentage > 75
                          ? 'bg-amber-500'
                          : 'bg-zinc-400',
                    )}
                    style={{
                      width: `${Math.min(currentUsage.dailySlackNotifications.percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className='flex justify-between text-xs text-zinc-400 mb-1.5'>
                  <span>Monthly</span>
                  <span>
                    {currentUsage.monthlySlackNotifications.current} of{' '}
                    {subscription.limits.slackNotificationLimit}
                  </span>
                </div>
                <div className='h-1 w-full bg-zinc-800 rounded-full'>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      (currentUsage.monthlySlackNotifications.current /
                        subscription.limits.slackNotificationLimit) *
                        100 >
                        90
                        ? 'bg-red-500'
                        : (currentUsage.monthlySlackNotifications.current /
                              subscription.limits.slackNotificationLimit) *
                              100 >
                            75
                          ? 'bg-amber-500'
                          : 'bg-zinc-400',
                    )}
                    style={{
                      width: `${Math.min((currentUsage.monthlySlackNotifications.current / subscription.limits.slackNotificationLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Usage Charts */}
      <div className='space-y-6'>
        <h3 className='text-lg font-medium text-white'>Usage Trends</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Notification Trends Chart */}
          <Card className='p-5 border-zinc-800 bg-zinc-950/50'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-sm font-medium text-white'>
                Notification Activity
              </h4>
              <div className='flex items-center gap-3 text-xs'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2 h-2 rounded-full bg-zinc-400'></div>
                  <span className='text-zinc-400'>Email</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2 h-2 rounded-full bg-zinc-600'></div>
                  <span className='text-zinc-400'>Slack</span>
                </div>
              </div>
            </div>

            <div className='h-[300px] w-full'>
              <ChartContainer
                className='h-full w-full'
                config={{
                  Email: { label: 'Email', color: '#9CA3AF' },
                  Slack: { label: 'Slack', color: '#4B5563' },
                }}
              >
                <ResponsiveContainer
                  className={'w-full h-full'}
                  width='100%'
                  height='100%'
                >
                  <AreaChart
                    data={chartData.emailSlack}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id='emailGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='0%'
                          stopColor='rgba(156, 163, 175, 0.3)'
                        />
                        <stop
                          offset='100%'
                          stopColor='rgba(156, 163, 175, 0)'
                        />
                      </linearGradient>
                      <linearGradient
                        id='slackGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop offset='0%' stopColor='rgba(75, 85, 99, 0.3)' />
                        <stop offset='100%' stopColor='rgba(75, 85, 99, 0)' />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='rgba(75, 85, 99, 0.2)'
                      vertical={false}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fill: 'rgba(156, 163, 175, 0.6)' }}
                      axisLine={{ stroke: 'rgba(75, 85, 99, 0.3)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(156, 163, 175, 0.6)' }}
                      axisLine={{ stroke: 'rgba(75, 85, 99, 0.3)' }}
                      tickLine={false}
                    />
                    <ChartTooltip />
                    <Area
                      type='monotone'
                      dataKey='Email'
                      stroke='#9CA3AF'
                      strokeWidth={2}
                      fillOpacity={1}
                      fill='url(#emailGradient)'
                    />
                    <Area
                      type='monotone'
                      dataKey='Slack'
                      stroke='#4B5563'
                      strokeWidth={2}
                      fillOpacity={1}
                      fill='url(#slackGradient)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          {/* Webhook Usage Chart */}
          <Card className='p-5 border-zinc-800 bg-zinc-950/50'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-sm font-medium text-white'>Webhook Usage</h4>
            </div>
            <div className='h-full w-full'>
              <ChartContainer
                className='h-[300px] w-full'
                config={{
                  value: { label: 'Webhook Usage', color: '#D1D5DB' },
                }}
              >
                <ResponsiveContainer
                  className={'w-full h-full'}
                  width='100%'
                  height='100%'
                >
                  <AreaChart
                    data={chartData.webhooks}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id='webhookGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='0%'
                          stopColor='rgba(209, 213, 219, 0.3)'
                        />
                        <stop
                          offset='100%'
                          stopColor='rgba(209, 213, 219, 0)'
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='rgba(75, 85, 99, 0.2)'
                      vertical={false}
                    />
                    <XAxis
                      dataKey='name'
                      tick={{ fill: 'rgba(156, 163, 175, 0.6)' }}
                      axisLine={{ stroke: 'rgba(75, 85, 99, 0.3)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(156, 163, 175, 0.6)' }}
                      axisLine={{ stroke: 'rgba(75, 85, 99, 0.3)' }}
                      tickLine={false}
                    />
                    <ChartTooltip />
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#D1D5DB'
                      strokeWidth={2}
                      fillOpacity={1}
                      fill='url(#webhookGradient)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {chartData.webhooks.length > 1 && (
              <WebhookTrend data={chartData.webhooks} />
            )}
          </Card>
        </div>
      </div>
    </div>
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
  return (
    <Card className='p-5 border-zinc-800 bg-zinc-950/50'>
      <div className='flex items-center justify-between mb-1'>
        <div className='flex items-center gap-2'>
          {icon}
          <h4 className='text-sm font-medium text-white'>{label}</h4>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className='text-zinc-500 hover:text-zinc-400'>
                <Info className='h-4 w-4' />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-xs'>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className='mt-4 mb-3'>
        <div className='flex justify-between text-xs text-zinc-400 mb-1.5'>
          <span>Used</span>
          <span>
            {current} of {max}
          </span>
        </div>
        <div className='h-1 w-full bg-zinc-800 rounded-full'>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              percentage > 90
                ? 'bg-red-500'
                : percentage > 75
                  ? 'bg-amber-500'
                  : 'bg-zinc-400',
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className='text-xs text-zinc-500 mt-2'>
        {percentage < 50 ? (
          <span>Good standing</span>
        ) : percentage < 75 ? (
          <span>Moderate usage</span>
        ) : percentage < 90 ? (
          <span>High usage</span>
        ) : (
          <span className='text-amber-500'>Near limit</span>
        )}
      </div>
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
    <div className='mt-3 text-xs flex items-center text-zinc-400'>
      <TrendingUp
        className={`h-3.5 w-3.5 mr-1.5 ${isUp ? '' : 'rotate-180 transform'}`}
      />
      <span>
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
    <div className='flex justify-between items-center'>
      <div className='space-y-2'>
        <Skeleton className='h-7 w-32 bg-zinc-800/50' />
        <Skeleton className='h-4 w-48 bg-zinc-800/50' />
      </div>
      <Skeleton className='h-6 w-24 bg-zinc-800/50' />
    </div>

    {/* Usage Metrics Skeleton */}
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {[...Array(3)].map((_, i) => (
        <Card key={i} className='p-5 border-zinc-800/50 bg-zinc-900/30'>
          <div className='flex justify-between items-start mb-6'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-4 rounded-full bg-zinc-800/50' />
              <Skeleton className='h-4 w-24 bg-zinc-800/50' />
            </div>
            <Skeleton className='h-4 w-4 rounded-full bg-zinc-800/50' />
          </div>
          <div className='space-y-4'>
            <div className='flex justify-between mb-2'>
              <Skeleton className='h-3 w-12 bg-zinc-800/50' />
              <Skeleton className='h-3 w-20 bg-zinc-800/50' />
            </div>
            <Skeleton className='h-2 w-full bg-zinc-800/50' />
            <Skeleton className='h-3 w-16 bg-zinc-800/50' />
          </div>
        </Card>
      ))}
    </div>

    {/* Notifications Section Header */}
    <div className='space-y-2'>
      <Skeleton className='h-6 w-32 bg-zinc-800/50' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className='p-5 border-zinc-800/50 bg-zinc-900/30'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded-full bg-zinc-800/50' />
                <Skeleton className='h-4 w-20 bg-zinc-800/50' />
              </div>
              <Skeleton className='h-4 w-4 rounded-full bg-zinc-800/50' />
            </div>
            <div className='space-y-6'>
              {[...Array(2)].map((_, j) => (
                <div key={j} className='space-y-3'>
                  <div className='flex justify-between'>
                    <Skeleton className='h-3 w-16 bg-zinc-800/50' />
                    <Skeleton className='h-3 w-24 bg-zinc-800/50' />
                  </div>
                  <Skeleton className='h-2 w-full bg-zinc-800/50' />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Charts Section */}
    <div className='space-y-4'>
      <Skeleton className='h-6 w-32 bg-zinc-800/50' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className='p-5 border-zinc-800/50 bg-zinc-900/30'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <Skeleton className='h-4 w-32 bg-zinc-800/50' />
                <div className='flex gap-4'>
                  <Skeleton className='h-4 w-16 bg-zinc-800/50' />
                  <Skeleton className='h-4 w-16 bg-zinc-800/50' />
                </div>
              </div>
              <Skeleton className='h-[240px] w-full bg-zinc-800/50' />
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error }: { error: string }) => (
  <Card className='p-6 border-red-900/20 bg-red-950/10'>
    <div className='flex flex-col items-center justify-center h-48 text-center'>
      <AlertTriangle className='h-8 w-8 text-red-500 mb-2' />
      <h3 className='text-lg font-medium text-white'>
        Failed to load usage data
      </h3>
      <p className='text-sm text-zinc-400 mt-1'>{error}</p>
      <button
        className='mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white text-sm'
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  </Card>
);

// Additional components needed
const Activity = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
  </svg>
);

const Database = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <ellipse cx='12' cy='5' rx='9' ry='3' />
    <path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' />
    <path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' />
  </svg>
);

export default UsageTab;
