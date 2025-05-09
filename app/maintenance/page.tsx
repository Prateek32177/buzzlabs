'use client';
import { Logo } from '@/components/Logo';

export default function MaintenancePage() {
  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center p-4'>
      <div className='text-center max-w-lg'>
        <Logo size='text-4xl' />
        <div className='mb-8'>
          <svg
            className='w-16 h-16 mx-auto text-zinc-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          </svg>
        </div>

        <h1 className='text-3xl font-light text-gray-400 mb-4'>
          We&apos;re Making Things Better
        </h1>

        <p className='text-gray-400 mb-8'>
          Our site is currently undergoing scheduled maintenance. We&apos;ll be
          back shortly with improvements to make your experience even better.
        </p>

        <div className='inline-flex items-center justify-center space-x-2'>
          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100' />
          <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200' />
        </div>
      </div>
    </div>
  );
}
