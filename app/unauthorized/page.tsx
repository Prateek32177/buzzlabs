import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className='w-full relative flex min-h-screen flex-col items-center justify-center  px-4 text-center overflow-hidden '>
      {/* Decorative line art elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-16 -left-16 w-64 h-64 border border-purple-200 rounded-full opacity-50 dark:border-purple-800'></div>
        <div className='absolute top-1/4 -right-24 w-96 h-96 border border-purple-200 rounded-full opacity-30 dark:border-purple-800'></div>
        <div className='absolute bottom-10 left-10 w-40 h-40 border border-purple-200 rounded-full opacity-40 dark:border-purple-800'></div>
        <div className='absolute top-1/3 left-1/4 w-24 h-24 border border-purple-200 rounded-full opacity-60 dark:border-purple-800'></div>

        {/* Diagonal lines */}
        <div className='absolute top-0 left-0 w-full h-full'>
          <svg
            className='w-full h-full opacity-10'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
          >
            <line
              x1='0'
              y1='100'
              x2='100'
              y2='0'
              stroke='currentColor'
              className='text-purple-500'
              strokeWidth='0.2'
            />
            <line
              x1='20'
              y1='100'
              x2='100'
              y2='20'
              stroke='currentColor'
              className='text-purple-500'
              strokeWidth='0.2'
            />
            <line
              x1='40'
              y1='100'
              x2='100'
              y2='40'
              stroke='currentColor'
              className='text-purple-500'
              strokeWidth='0.2'
            />
            <line
              x1='60'
              y1='100'
              x2='100'
              y2='60'
              stroke='currentColor'
              className='text-purple-500'
              strokeWidth='0.2'
            />
            <line
              x1='80'
              y1='100'
              x2='100'
              y2='80'
              stroke='currentColor'
              className='text-purple-500'
              strokeWidth='0.2'
            />
          </svg>
        </div>
      </div>

      <div className='relative z-10 mx-auto max-w-md space-y-8'>
        {/* Custom illustration */}
        <div className='mx-auto w-40 h-40 relative'>
          <div className='absolute inset-0 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center'>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              className='w-20 h-20 text-purple-600 dark:text-purple-300'
            >
              <path
                d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 8v4M12 16h.01'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div className='absolute inset-0 rounded-full border-2 border-purple-300 dark:border-purple-700 opacity-50 scale-110'></div>
          <div className='absolute inset-0 rounded-full border border-purple-200 dark:border-purple-800 scale-125'></div>
        </div>

        <h1 className='text-5xl font-bold tracking-tighter text-purple-900 dark:text-purple-50'>
          Unauthorized
        </h1>

        <p className='text-lg text-purple-700 dark:text-purple-200'>
          Something's missing, Access Denied. Unauthorized access ! Please
          login.
        </p>

        <div>
          <Button asChild>
            <Link href='/'>Return to Home</Link>
          </Button>
        </div>
      </div>

      {/* Animated gradient line at bottom */}
      <div className='absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-300 via-purple-600 to-purple-300 bg-[length:200%_auto] animate-[gradient_3s_ease-in-out_infinite] dark:from-purple-700 dark:via-purple-400 dark:to-purple-700'></div>
    </div>
  );
}
