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
  webhookLimitPercentage < 80 ? 'bg-green-500' : 'bg-red-500';
// notifications
const maxNotification = 1000;
const currentNotiCount = 950;
const notificationLimitPercentage = (currentNotiCount / maxNotification) * 100;
const NotificationLimitColor =
  notificationLimitPercentage < 80 ? 'bg-green-500' : 'bg-red-500';
const UsageTab = () => {
  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Consumption Summary */}
      <Card className='p-6 glass'>
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

      {/* Channel Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Email notifications */}
        <Card className='p-6 glass'>
          <div className='flex items-center gap-2 mb-4'>
            <Mail className='h-5 w-5 text-hookflo-accent' />
            <h3 className='text-lg font-medium text-white'>
              Email Notifications
            </h3>
          </div>
          <div className='h-[200px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={emailData}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id='emailGradient'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='5%' stopColor='#0D66D0' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#0D66D0' stopOpacity={0.1} />
                  </linearGradient>
                </defs>
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
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='#0D66D0'
                  fill='url(#emailGradient)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-3 text-sm text-hookflo-green flex items-center'>
            <TrendingUp className='h-4 w-4 mr-1' />
            <span>Trending up by 8.3% this week</span>
          </div>
        </Card>

        {/* Slack notifications */}
        <Card className='p-6 glass'>
          <div className='flex items-center gap-2 mb-4'>
            <Slack className='h-5 w-5 text-hookflo-accent' />
            <h3 className='text-lg font-medium text-white'>
              Slack Notifications
            </h3>
          </div>
          <div className='h-[200px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={slackData}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient
                    id='slackGradient'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='5%' stopColor='#0D66D0' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#0D66D0' stopOpacity={0.1} />
                  </linearGradient>
                </defs>
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
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='#0D66D0'
                  fill='url(#slackGradient)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-3 text-sm text-hookflo-green flex items-center'>
            <TrendingUp className='h-4 w-4 mr-1' />
            <span>Trending up by 12.1% this week</span>
          </div>
        </Card>
      </div>

      {/* Webhook Usage */}
      <Card className='p-6 glass'>
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
              <YAxis tick={{ fill: '#999' }} axisLine={{ stroke: '#333333' }} />
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
                stroke='#0D66D0'
                strokeWidth={2}
                dot={{ r: 4, fill: '#0D66D0', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#0D66D0', strokeWidth: 0 }}
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
  );
};

export default UsageTab;
