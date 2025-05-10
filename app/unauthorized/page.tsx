'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center p-4'>
      <div className='text-center max-w-lg'>
        <div className='mb-8 '>
          <svg
            viewBox='0 0 24 24'
            className='w-32 h-32 mx-auto text-zinc-400 p-3 border-2 border-zinc-700 rounded-full'
          >
            <path
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01'
            />
          </svg>
        </div>

        <h1 className='text-3xl font-light text-gray-400 mb-4'>Unauthorized</h1>

        <p className='text-gray-400 mb-8'>
          Access Denied. You are not authorized to view this page.
        </p>

        <Button asChild>
          <Link href='/'>Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
