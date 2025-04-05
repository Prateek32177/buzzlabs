'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Mail, Slack, Clock, TrendingUp } from 'lucide-react';
import { Value } from '@radix-ui/react-select';
import EmailSlackCharts from './EmailSlackCharts';

// Sample data for charts
const emailData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 590 },
  { name: 'Sat', value: 320 },
  { name: 'Sun', value: 400 },
];

const slackData = [
  { name: 'Mon', value: 300 },
  { name: 'Tue', value: 450 },
  { name: 'Wed', value: 380 },
  { name: 'Thu', value: 520 },
  { name: 'Fri', value: 400 },
  { name: 'Sat', value: 280 },
  { name: 'Sun', value: 350 },
];

const webhookData = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 30 },
  { name: 'Mar', value: 50 },
  { name: 'Apr', value: 28 },
  { name: 'May', value: 18 },
  { name: 'Jun', value: 24 },
  { name: 'Jul', value: 35 },
  { name: 'Aug', value: 54 },
];
// webhooks
const maxWebhook = 100;
const currentWebhook = 75;
const webhookLimitPercentage = (currentWebhook / maxWebhook) * 100;
const webhookLimitColor =
  webhookLimitPercentage < 80 ? 'bg-violet-500' : 'bg-purple-800';
// notifications
const maxNotification = 1000;
const currentNotiCount = 950;
const notificationLimitPercentage = (currentNotiCount / maxNotification) * 100;
const NotificationLimitColor =
  notificationLimitPercentage < 80 ? 'bg-violet-500' : 'bg-purple-800';
const UsageTab = () => {
  return (
    <div className='space-y-6 animate-fade-in mb-16'>
      {/* Consumption Summary */}
      <Card className='p-6  glass-card rounded-lg  h-full mt-6 '>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h3 className='text-lg font-medium text-white'>
              Consumption Summary
            </h3>
            <p className='text-sm text-gray-400'>Free plan • amoditjha</p>
          </div>
          <div className='text-sm flex items-center text-hookflo-green'>
            <Clock className='h-4 w-4 mr-1' />
            Your limit will reset at midnight IST
          </div>
        </div>

        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>Daily webhook limit</span>
            <span className='text-sm text-gray-400'>
              {currentWebhook} / {maxWebhook} webhooks
            </span>
          </div>
          <ProgressBar
            value={currentWebhook}
            max={maxWebhook}
            barColor={webhookLimitColor}
          />
        </div>
        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>Daily webhook limit</span>
            <span className='text-sm text-gray-400'>
              {currentNotiCount} / {maxNotification} Notifications
            </span>
          </div>
          <ProgressBar
            value={currentNotiCount}
            max={maxNotification}
            barColor={NotificationLimitColor}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-gray-400 mb-3'>
              Active webhooks
            </h4>
            <div className='text-3xl font-bold text-white'>
              {currentWebhook}
            </div>
          </div>
          <div>
            <h4 className='text-sm font-medium text-gray-400 mb-3'>
              Monthly notifications
            </h4>
            <div className='text-3xl font-bold text-white'>
              {currentNotiCount}
            </div>
          </div>
        </div>
      </Card>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Email and Slack Usage */}
        <EmailSlackCharts />
        {/* Webhook Usage */}
        <Card className='p-6 glass-card rounded-lg  h-full mt-6'>
          <h3 className='text-lg font-medium text-white mb-4'>Webhook Usage</h3>
          <div className='h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={webhookData}
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
          <div className='mt-3 text-sm text-hookflo-green flex items-center'>
            <TrendingUp className='h-4 w-4 mr-1' />
            <span>Trending up by 5.2% this month</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UsageTab;
