'use client';

import type React from 'react';
import { PolarLogo } from '../Logos/Polar';
import { SupabaseLogo } from '../Logos/Supabase';
import { ResendLogo } from '../Logos/Resend';
import { ClerkLogo } from '../Logos/Clerk';
import { LoopsLogo } from '../Logos/Loops';
import { Plug } from 'lucide-react';
import { GithubLogo } from '../Logos/Github';

export default function Integration() {
  return (
    <>
      <section className='py-16 md:py-20 relative overflow-hidden bg-zinc-900'>
        <div className='grid-pattern' />
        <div>
          <div className='text-center '>
            <div className='flex justify-center mb-6'>
              <div
                className={`inline-flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-purple-400/20 transition-all duration-700 opacity-100 translate-y-0`}
              >
                <Plug className='w-4 h-4 text-purple-400' />
                <span className='text-purple-400 text-sm font-medium'>
                  Powerful Integrations
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className='text-center mb-8 px-4'>
              <h2 className='text-3xl md:text-5xl font-medium text-white max-w-4xl mx-auto leading-tight'>
                Connect SuperHook with your favorite tools and services.
              </h2>
            </div>
          </div>
          <IntegrationSection />
        </div>
      </section>
    </>
  );
}

function IntegrationSection() {
  return (
    <>
      <div className='overflow-hidden  relative'>
        <div className='logo-scroll py-8'>
          {[...Array(4)].map((_, setIndex) => (
            <div key={setIndex} className='flex gap-8'>
              {[
                { name: 'Polar', icon: PolarLogo, comingSoon: true },
                { name: '', icon: GithubLogo, comingSoon: false },
                { name: 'Supabase', icon: SupabaseLogo, comingSoon: false },
                { name: 'Clerk', icon: ClerkLogo, comingSoon: true },
              ].map((brand, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className='flex items-center justify-center w-[250px] h-20 flex-shrink-0 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-md'
                >
                  <brand.icon className='w-8 h-8 stroke-current' />
                  <span className='ml-3 font-medium text-white/90'>
                    {brand.name}
                  </span>
                  {brand.comingSoon && (
                    <span className='ml-2 text-xs font-semibold text-yellow-400 bg-yellow-100/5 px-2 py-1 rounded'>
                      Coming Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
