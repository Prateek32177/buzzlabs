'use client';

import { Button } from '@/components/ui/button';
import { Playfair_Display, Inter } from 'next/font/google';
import { SignInDialog } from '@/components/auth/SIgnInDialog';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '600' });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'] });

export default function GetStarted() {
  return (
    <div className='relative bg-zinc-950 flex items-center justify-center px-6 py-16'>
      <div className='w-full max-w-5xl'>
        <div className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9049f2] via-[#b89eef] to-[#791ad8] px-10 py-24 text-center shadow-2xl ring-1 ring-white/10'>
          {/* Noise Layer */}
          <div className='absolute inset-0 z-0 pointer-events-none'>
            <svg
              className='absolute inset-0 w-full h-full'
              xmlns='http://www.w3.org/2000/svg'
            >
              <defs>
                <filter
                  id='hookflo-noise'
                  x='-20%'
                  y='-20%'
                  width='140%'
                  height='140%'
                >
                  <feTurbulence
                    type='fractalNoise'
                    baseFrequency='0.7'
                    numOctaves='3'
                    seed='88'
                  />
                  <feColorMatrix type='saturate' values='0' />
                  <feComponentTransfer>
                    <feFuncR type='linear' slope='2' />
                    <feFuncG type='linear' slope='2' />
                    <feFuncB type='linear' slope='2' />
                  </feComponentTransfer>
                  <feColorMatrix
                    type='matrix'
                    values='
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 6 -2'
                  />
                </filter>
              </defs>
              <g>
                <rect
                  width='100%'
                  height='100%'
                  fill='url(#hookflo-gradient)'
                />
                <rect
                  width='100%'
                  height='100%'
                  fill='transparent'
                  filter='url(#hookflo-noise)'
                  opacity='0.3'
                  style={{ mixBlendMode: 'overlay' }}
                />
              </g>
            </svg>
          </div>

          {/* Headline */}

          <h1 className='relative z-10 font-serif text-4xl sm:text-5xl  tracking-tight text-zinc-900'>
            Alert and Log from Anywhere. Instantly.
          </h1>

          {/* Subheading */}

          <p className='relative z-10 mt-6 text-zinc-600 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed'>
            Instantly send alerts from your code, webhooks, GitHub Actions, or
            any AI tool with a simple, reliable layer.
          </p>
          {/* CTA */}
          <div className='relative z-10 mt-10 justify-center flex'>
            <SignInDialog>
              <Button className='group relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900/90 text-zinc-100 px-8 py-5 pr-2 text-base font-medium rounded-full border border-zinc-700 shadow-xl hover:shadow-2xl hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-3 '>
                Get Started for Free
                <span className='ml-3 flex items-center justify-center w-8 h-8 rounded-full bg-white transition group-hover:bg-zinc-200'>
                  <svg
                    className='w-5 h-5 text-black transition-transform group-hover:translate-x-1'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2.2}
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </span>
              </Button>
            </SignInDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
