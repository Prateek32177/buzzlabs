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
// Enhanced data with more points for a smoother curve
const data = [
  { date: 'Apr 3', Email: 140, Slack: 120 },
  { date: 'Apr 8', Email: 190, Slack: 160 },
  { date: 'Apr 13', Email: 130, Slack: 110 },
  { date: 'Apr 18', Email: 180, Slack: 140 },
  { date: 'Apr 23', Email: 220, Slack: 180 },
  { date: 'Apr 29', Email: 280, Slack: 240 },
  { date: 'May 4', Email: 180, Slack: 160 },
  { date: 'May 9', Email: 220, Slack: 170 },
  { date: 'May 15', Email: 170, Slack: 140 },
  { date: 'May 21', Email: 230, Slack: 190 },
  { date: 'May 27', Email: 180, Slack: 150 },
  { date: 'Jun 2', Email: 220, Slack: 170 },
  { date: 'Jun 7', Email: 250, Slack: 200 },
  { date: 'Jun 12', Email: 280, Slack: 220 },
  { date: 'Jun 17', Email: 220, Slack: 180 },
  { date: 'Jun 23', Email: 250, Slack: 210 },
  { date: 'Jun 30', Email: 270, Slack: 230 },
];

const EmailSlackCharts = () => {
  return (
    <Card className='glass-card rounded-lg  h-full mt-6 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-medium text-white'>Apr 6</h3>
        <div className='flex items-center space-x-6'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 rounded-sm bg-[#a78bfa]'></div>
            <span className='text-gray-300'>Email</span>
            <span className='text-sm text-white font-bold ml-1'>340</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 rounded-sm bg-[#6d28d9]'></div>
            <span className='text-gray-300'>Slack</span>
            <span className='text-sm text-white font-bold ml-1'>301</span>
          </div>
        </div>
      </div>

      <div className='h-[300px] w-full'>
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
      </div>
    </Card>
  );
};

export default EmailSlackCharts;
