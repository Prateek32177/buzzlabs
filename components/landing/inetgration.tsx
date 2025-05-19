'use client';

import type React from 'react';
import { PolarLogo } from '../Logos/Polar';
import { SupabaseLogo } from '../Logos/Supabase';
import { ClerkLogo } from '../Logos/Clerk';
import { Plug } from 'lucide-react';
import { GithubLogo } from '../Logos/Github';
import { StripeWordmarkLogo } from '../Logos/StripeLogo';
import { motion } from 'framer-motion';
import { DodoWordmarkLogo } from '../Logos/DodoPayments';

interface Partner {
  name: string;
  icon: React.FC<{ className: string }>;
  comingSoon: boolean;
}

export default function Integration() {
  return (
    <section className='py-16 md:py-20 relative overflow-hidden bg-black/60'>
      <div className='grid-pattern' />
      <div>
        <SectionHeader />
        <IntegrationSection />
      </div>
    </section>
  );
}

function IntegrationSection() {
  return (
    <div className='overflow-hidden relative'>
      <div className='logo-scroll py-8'>
        {[...Array(4)].map((_, setIndex) => (
          <div key={setIndex} className='flex gap-8'>
            {[
              { name: '', icon: StripeWordmarkLogo, comingSoon: false },
              { name: 'Supabase', icon: SupabaseLogo, comingSoon: false },
              {
                name: '',
                icon: DodoWordmarkLogo,
                comingSoon: false,
              },

              { name: 'Clerk', icon: ClerkLogo, comingSoon: false },

              { name: '', icon: GithubLogo, comingSoon: false },
              { name: 'Polar', icon: PolarLogo, comingSoon: true },
            ].map((brand, i) => (
              <div key={i} className='flex-1'>
                <IntegrationCard partner={brand} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationCard({ partner }: { partner: Partner }) {
  const hasName = partner.name?.trim().length > 0;

  return (
    <motion.div
      className='flex items-center justify-center w-[220px] h-24 flex-shrink-0 p-4 shadow-sm group relative bg-gradient-to-b border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm bg-zinc-900/70 hover:bg-black/60 transition-all duration-300'
      whileHover={{
        y: -4,
        scale: 1.015,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500' />

      <div
        className={`flex flex-col items-center justify-center w-full h-full text-center ${
          hasName ? 'gap-1.5' : ''
        }`}
      >
        <div
          className={`flex ${
            hasName ? 'flex-row items-center gap-2' : 'justify-center'
          }`}
        >
          <partner.icon className='w-7 h-7 text-white transition-transform duration-300 group-hover:scale-105' />
          {hasName && (
            <span className='text-white font-medium'>{partner.name}</span>
          )}
          {partner.comingSoon && (
            <span className='text-xs font-semibold text-yellow-400 bg-yellow-100/5 px-2 py-1 rounded'>
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader() {
  return (
    <div className='text-center mb-16 max-w-sm sm:max-w-xl mx-auto'>
      <motion.div
        className='flex justify-center mb-4'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className='inline-flex items-center gap-2 bg-purple-950/50 px-4 py-1.5 rounded-full border border-purple-400/30 backdrop-blur-sm'>
          <Plug className='w-4 h-4 text-purple-300' />
          <span className='text-purple-300 text-sm font-medium'>
            Seamless Integrations
          </span>
        </div>
      </motion.div>

      <motion.h3
        className='sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-tight text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-4'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Connect with your favorite tools effortlessly
      </motion.h3>

      <motion.p
        className='text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        SuperHook flawlessly integrates with the tools you already use, creating
        a seamless workflow without any friction.
      </motion.p>
    </div>
  );
}
