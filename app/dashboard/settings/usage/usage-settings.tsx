'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Mail,
  Slack,
  Clock,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import EmailSlackCharts from './EmailSlackCharts';
import { useUsageData } from '@/hooks/use-usage-data';
import { formatBytes } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
const UsageTab = () => {
  const { usageData, isLoading, error } = useUsageData();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader text='Getting usage data...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <AlertTriangle className='h-8 w-8 text-red-500 mb-2' />
        <h3 className='text-lg font-medium text-white'>
          Failed to load usage data
        </h3>
        <p className='text-sm text-gray-400 mt-1'>{error}</p>
        <button
          className='mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-md text-white text-sm'
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  const { subscription, usage } = usageData;
  // Calculate percentages for progress bars
  const webhookLimitPercentage =
    (usage.current.activeWebhooks / subscription.limits.webhookLimit) * 100;
  const notificationLimitPercentage =
    (usage.current.totalNotifications / subscription.limits.notificationLimit) *
    100;

  // Determine color based on usage percentage
  const webhookLimitColor =
    webhookLimitPercentage < 80 ? 'bg-purple-400' : 'bg-purple-800';
  const notificationLimitColor =
    notificationLimitPercentage < 80 ? 'bg-purple-400' : 'bg-purple-800';

  // Format tier name for display
  const tierName =
    subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1);

  // Get latest day's email and slack counts for display
  const latestData =
    usage.emailSlackData.length > 0
      ? usage.emailSlackData[usage.emailSlackData.length - 1]
      : { date: 'Today', Email: 0, Slack: 0 };

  return (
    <div className='space-y-6 animate-fade-in mb-16'>
      {/* Consumption Summary */}
      <Card className='p-6 glass-card rounded-lg h-full mt-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h3 className='text-lg font-medium text-white'>
              Consumption Summary
            </h3>
            <>
              <Badge className='bg-purple-300/70 my-2'>{tierName} plan</Badge>
              {usage.hasReachedLimit && (
                <span className='text-red-500 font-medium'>Limit reached</span>
              )}
            </>
          </div>
          <div className='text-sm flex items-center text-hookflo-green'>
            <Clock className='h-4 w-4 mr-1' />
            Your daily limit will reset at midnight IST
          </div>
        </div>

        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>Webhook limit</span>
            <span className='text-sm text-gray-400'>
              {usage.current.activeWebhooks} /{' '}
              {subscription.limits.webhookLimit} webhooks
            </span>
          </div>
          <ProgressBar
            value={usage.current.activeWebhooks}
            max={subscription.limits.webhookLimit}
            barColor={webhookLimitColor}
          />
        </div>

        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>
              Monthly notification limit
            </span>
            <span className='text-sm text-gray-400'>
              {usage.current.totalNotifications} /{' '}
              {subscription.limits.notificationLimit} Notifications
            </span>
          </div>
          <ProgressBar
            value={usage.current.totalNotifications}
            max={subscription.limits.notificationLimit}
            barColor={notificationLimitColor}
          />
        </div>

        {/* Daily usage limits */}
        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>Daily requests</span>
            <span className='text-sm text-gray-400'>
              {usage.current.requests} / {subscription.limits.dailyRequests}{' '}
              requests
            </span>
          </div>
          <ProgressBar
            value={usage.current.requests}
            max={subscription.limits.dailyRequests}
            barColor={
              (usage.current.requests / subscription.limits.dailyRequests) *
                100 <
              80
                ? 'bg-violet-500'
                : 'bg-purple-800'
            }
          />
        </div>

        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>Daily data volume</span>
            <span className='text-sm text-gray-400'>
              {formatBytes(usage.current.totalDataVolume)} /{' '}
              {subscription.limits.dailyDataVolumeMB} MB
            </span>
          </div>
          <ProgressBar
            value={usage.current.totalDataVolume}
            max={subscription.limits.dailyDataVolumeMB * 1024 * 1024}
            barColor={
              (usage.current.totalDataVolume /
                (subscription.limits.dailyDataVolumeMB * 1024 * 1024)) *
                100 <
              80
                ? 'bg-violet-500'
                : 'bg-purple-800'
            }
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-gray-400 mb-3'>
              Active webhooks
            </h4>
            <div className='text-3xl font-bold text-white'>
              {usage.current.activeWebhooks}
            </div>
          </div>
          <div>
            <h4 className='text-sm font-medium text-gray-400 mb-3'>
              Monthly notifications
            </h4>
            <div className='text-3xl font-bold text-white'>
              {usage.current.totalNotifications}
            </div>
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Email and Slack Usage */}
        <EmailSlackCharts
          data={usage.emailSlackData}
          latestDate={latestData.date}
          emailCount={latestData.Email}
          slackCount={latestData.Slack}
        />

        {/* Webhook Usage */}
        <Card className='p-6 glass-card rounded-lg h-full mt-6'>
          <h3 className='text-lg font-medium text-white mb-4'>Webhook Usage</h3>
          <div className='h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={usage.webhookData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#333333'
                  vertical={false}
                />
                <XAxis
                  dataKey='name'
                  tick={{ fill: '#999' }}
                  axisLine={{ stroke: '#333333' }}
                />
                <YAxis
                  tick={{ fill: '#999' }}
                  axisLine={{ stroke: '#333333' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderColor: '#333333',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#999' }}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#9F7AEA'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#9F7AEA', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#9F7AEA', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {usage.webhookData.length > 1 && (
            <WebhookTrend data={usage.webhookData} />
          )}
        </Card>
      </div>
    </div>
  );
};

// Helper component to show webhook trend
const WebhookTrend = ({ data }: { data: any }) => {
  if (data.length < 2) return null;

  // Calculate trend percentage by comparing last two months
  const lastIndex = data.length - 1;
  const currentMonth = data[lastIndex].value;
  const previousMonth = data[lastIndex - 1].value;

  const percentageChange =
    previousMonth === 0
      ? 100
      : (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1);

  const isUp = currentMonth >= previousMonth;

  return (
    <div
      className={`mt-3 text-sm flex items-center ${isUp ? 'text-hookflo-green' : 'text-red-500'}`}
    >
      {isUp ? (
        <TrendingUp className='h-4 w-4 mr-1' />
      ) : (
        <TrendingUp className='h-4 w-4 mr-1 transform rotate-180' />
      )}
      <span>
        {isUp ? 'Trending up' : 'Trending down'} by{' '}
        {Math.abs(Number(percentageChange))}% this month
      </span>
    </div>
  );
};

export default UsageTab;
