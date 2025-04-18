import { Loader as SpinnerIcon } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  text?: string;
  size?: number;
  className?: string;
  textClassName?: string;
  spinnerClassName?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  text,
  size = 32,
  className,
  textClassName,
  spinnerClassName,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-zinc-300',
        className,
      )}
    >
      <SpinnerIcon
        className={cn('animate-spin text-zinc-400', spinnerClassName)}
        size={size}
      />
      {text && (
        <span className={cn('text-sm text-zinc-400', textClassName)}>
          {text}
        </span>
      )}
    </div>
  );
};
