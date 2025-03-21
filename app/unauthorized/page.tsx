import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center px-4 text-center'>
      <div className='mx-auto max-w-md space-y-8'>
        <div className='mx-auto w-40 h-40 relative'>
          <div className='absolute inset-0 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center'>
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
        <h1 className='text-4xl font-bold text-purple-900 dark:text-purple-50'>
          Unauthorized
        </h1>

        <p className='text-base text-purple-700 dark:text-purple-200'>
          Something's missing, Access Denied. Unauthorized access !
        </p>

        <div>
          <Button asChild>
            <Link href='/'>Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
