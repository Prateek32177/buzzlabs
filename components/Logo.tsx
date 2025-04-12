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
}

export function Logo({
  variant = 'green',
  size = 'text-sm',
  hideText = false,
}: LogoProps) {
  const text = 'hookflo';

  return (
    <Link href='/' className='cursor-pointer inline-flex items-end gap-1'>
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
    </Link>
  );
}
