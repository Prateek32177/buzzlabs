'use client';

import type React from 'react';
import { PolarLogo } from '../Logos/Polar';
import { SupabaseLogo } from '../Logos/Supabase';
import { ResendLogo } from '../Logos/Resend';
import { ClerkLogo } from '../Logos/Clerk';
import { LoopsLogo } from '../Logos/Loops';

export default function Integration() {
  return (
    <>
      <section className='py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-black to-gray-900'>
        <div className='grid-pattern' />
        <div>
          <div className='text-center '>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 '>
              Powerful Integrations
            </h2>
            <p className='text-white/70 max-w-2xl mx-auto'>
              Connect SuperHook with your favorite tools and services
            </p>
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
