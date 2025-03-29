import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-1.5 px-4 sm:p-2 sm:px-6 text-center font-semibold',
        className,
      )}
      {...props}
    >
      <div className='flex items-center gap-1 sm:gap-2'>
        <span className='relative flex size-[8px] sm:size-[10px] transition-all duration-300 group-hover:scale-[100.8]'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75'></span>
          <span className='relative inline-flex size-[8px] sm:size-[10px] rounded-full bg-white'></span>
        </span>
        <span className='inline-block transition-all duration-300 group-hover:translate-x-8 sm:group-hover:translate-x-12 group-hover:opacity-0'>
          {children}
        </span>
      </div>
      <div className='absolute top-0 z-10 flex h-full w-full translate-x-8 sm:translate-x-12 items-center justify-center gap-1 sm:gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-3 sm:group-hover:-translate-x-5 group-hover:opacity-100'>
        <span>{children}</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
