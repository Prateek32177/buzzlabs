'use client';

import { Geist } from 'next/font/google';
import Link from 'next/link';
import { HookfloIcon } from '@/components/Logos/Hookflo';

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

interface LogoProps {
  variant?: 'green' | 'white';
  size?: string;
  showAlpha?: boolean;
  hideText?: boolean;
  showBeta?: boolean; // New prop for beta badge
}

export function Logo({
  variant = 'green',
  size = 'text-sm',
  hideText = false,
  showBeta = false, // Default to false
}: LogoProps) {
  const text = 'hookflo';

  return (
    <Link href='/' className='cursor-pointer inline-flex items-end gap-1'>
      <div className='relative flex place-items-center'>
        <div className='relative flex place-items-end'>
          <HookfloIcon className='w-8 h-8 inline-flex' />
          <h1
            className={`
            font-bold
            relative
            z-20
            text-white/90
            -ml-1
            mb-[3px]
            text-lg
            ${hideText ? 'hidden' : 'flex'}
            sm:flex
          `}
          >
            {text}
          </h1>
        </div>
        {showBeta && (
          <span
            className='
            hidden
            sm:inline-flex
            items-center
            px-1.5
            py-0.5
            ml-2
            -mb-1
            text-xs
            font-medium
            text-white/70
            bg-purple-400/30
            rounded-full
            backdrop-blur-sm
            border
            border-purple-400/40
          '
          >
            BETA
          </span>
        )}
      </div>
    </Link>
  );
}
