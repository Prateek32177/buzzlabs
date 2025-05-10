'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface UsageChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  showGrid?: boolean;
  tooltipFormatter?: (value: number) => string;
  nameKey?: string;
  valueKey?: string;
}

export function UsageChart({
  data,
  dataKeys,
  colors,
  showGrid = true,
  tooltipFormatter,
  nameKey = 'date',
  valueKey = 'value',
}: UsageChartProps) {
  // Create config object for ChartContainer
  const config: Record<string, { label: string; color: string }> = {};

  dataKeys.forEach((key, index) => {
    config[key] = {
      label: key,
      color: colors[index],
    };
  });

  // Create gradient definitions for each color
  const gradientDefs = colors.map((color, index) => {
    const id = `gradient-${index}`;
    return (
      <linearGradient key={id} id={id} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stopColor={color} stopOpacity={0.2} />
        <stop offset='100%' stopColor={color} stopOpacity={0} />
      </linearGradient>
    );
  });

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-card border border-white/10 rounded-lg shadow-lg p-3'>
          <p className='text-white/80 text-xs font-medium mb-2'>{label}</p>
          {payload.map((entry, index) => (
            <div
              key={`tooltip-${index}`}
              className='flex items-center gap-2 mb-1'
            >
              <div
                className='w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: entry.color }}
              />
              <p className='text-xs'>
                <span className='font-medium text-white'>{entry.name}: </span>
                <span className='text-white/70'>
                  {tooltipFormatter
                    ? tooltipFormatter(entry.value as number)
                    : entry.value}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={config} className='h-full w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <defs>{gradientDefs}</defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(255, 255, 255, 0.05)'
              vertical={false}
            />
          )}

          <XAxis
            dataKey={nameKey}
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickLine={false}
            tickMargin={10}
            padding={{ left: 10, right: 10 }}
          />

          <YAxis
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickLine={false}
            tickMargin={10}
            tickCount={5}
            domain={['auto', 'auto']}
          />

          <Tooltip content={<CustomTooltip />} />

          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type='monotone'
              dataKey={key}
              stroke={colors[index]}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${index})`}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: 'hsl(var(--background))',
                fill: colors[index],
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
