import React from 'react';
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/charts';
import { Card } from '@/components/ui/card';

interface EmailSlackChartsProps {
  data: Array<{
    date: string;
    Email: number;
    Slack: number;
  }>;
  latestDate: string;
  emailCount: number;
  slackCount: number;
}

const EmailSlackCharts: React.FC<EmailSlackChartsProps> = ({
  data,
  latestDate = 'Today',
  emailCount = 0,
  slackCount = 0,
}) => {
  return (
    <Card className='glass-card rounded-lg h-full mt-6 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-medium text-white'>{latestDate}</h3>
        <div className='flex items-center space-x-6'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 rounded-sm bg-[#a78bfa]'></div>
            <span className='text-gray-300'>Email</span>
            <span className='text-sm text-white font-bold ml-1'>
              {emailCount}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 rounded-sm bg-[#6d28d9]'></div>
            <span className='text-gray-300'>Slack</span>
            <span className='text-sm text-white font-bold ml-1'>
              {slackCount}
            </span>
          </div>
        </div>
      </div>

      <div className='h-[300px] w-full'>
        {data.length > 0 ? (
          <ChartContainer
            config={{
              Email: { theme: { light: '#34d399', dark: '#34d399' } },
              Slack: { theme: { light: '#059669', dark: '#059669' } },
            }}
            className='h-full w-full'
          >
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#333'
                vertical={false}
              />
              <XAxis
                dataKey='date'
                tick={{ fill: '#999' }}
                tickLine={false}
                axisLine={{ stroke: '#333' }}
                height={30}
              />
              <YAxis
                tick={{ fill: '#999' }}
                tickLine={false}
                axisLine={{ stroke: '#333' }}
                allowDecimals={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator='line'
                    nameKey='dataKey'
                    className='backdrop-blur-md bg-black/70 border-violet-500/30'
                  />
                }
              />
              <Line
                type='monotone'
                dataKey='Email'
                stroke='#a78bfa'
                strokeWidth={2.5}
                dot={true}
                activeDot={{ r: 6, fill: '#a78bfa' }}
                isAnimationActive={true}
                animationDuration={1500}
              />
              <Line
                type='monotone'
                dataKey='Slack'
                stroke='#6d28d9'
                strokeWidth={2.5}
                dot={true}
                activeDot={{ r: 6, fill: '#6d28d9' }}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-400'>No historical data available yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmailSlackCharts;
