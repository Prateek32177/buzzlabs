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
          font-['Boldonse'] font-normal
          ${size}
          animate-fade-in
          relative
          z-20
          text-zinc-300
        `}
      >
        {text}
      </h1>
    </Link>
  );
}
