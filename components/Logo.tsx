'use client';

import { Luckiest_Guy } from 'next/font/google';
import Link from 'next/link';

const logoFont = Luckiest_Guy({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

interface LogoProps {
  variant?: 'green' | 'white';
  size?: string;
  showAlpha?: boolean;
}

export function Logo({ variant = 'green', size = 'text-sm' }: LogoProps) {
  const text = 'Hookflo';

  return (
    <Link href='/' className='cursor-pointer inline-flex items-center gap-1'>
      <h1
        className={`
          font-['Boldonse']
          text-base
          relative
          z-20
          bg-gradient-to-r from-purple-500 to-rose-300
          text-transparent
          bg-clip-text
        `}
      >
        {text}
      </h1>
    </Link>
  );
}
