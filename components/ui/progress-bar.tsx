
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barColor?: string;
}

const ProgressBar = ({ value, max, className, barColor = 'bg-hookflo-blue' }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full bg-gray-800 rounded-full h-2.5 overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-300", barColor)} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
