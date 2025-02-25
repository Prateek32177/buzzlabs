'use client';

import { Doto } from 'next/font/google';
import Link from 'next/link';

const logoFont = Doto({
  weight: '800',
  subsets: ['latin'],
  style: 'normal',
  preload: true,
});

interface LogoProps {
  variant?: 'green' | 'white';
  size?: string;
  showAlpha?: boolean;
}

export function Logo({ variant = 'green', size = 'text-xl' }: LogoProps) {
  return (
    <Link href='/' className='cursor-pointer inline-flex items-center gap-1'>
      <h1
        className={`
                    ${logoFont.className}
                    ${size}

                     text-2xl  bg-clip-text text-transparent bg-gradient-to-tr from-purple-300 to-purple-600
                    relative
                    z-20
                    transition-all duration-300 ease-in-out
                `}
      >
        Superhook
      </h1>
    </Link>
  );
}
