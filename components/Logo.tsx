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
  showBeta?: boolean;
}

export function Logo({
  variant = 'green',
  size = 'text-sm',
  hideText = false,
  showBeta = false,
}: LogoProps) {
  const text = 'Hookflo';

  return (
    <Link href='/' className='cursor-pointer inline-flex items-end gap-1'>
      <div className='relative flex place-items-center'>
        <div className='relative flex place-items-end'>
          <HookfloIcon className='w-8 h-8 inline-flex' />
          <h1
            className={`
            font-semibold
            relative
            z-20
            text-white/90
            mb-[3px]
            text-lg
            ${size}
            ${hideText ? 'hidden sm:block' : 'block'}
            `}
          >
            {text}
          </h1>
        </div>
        {showBeta && (
          <span
            className='
            inline-flex
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
