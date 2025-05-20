'use client';

import { WebhookManagement } from '@/components/dashboard/WebhookManagement';
import { PlanLimitsDialog } from '../settings/usage/usage-settings';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const useCases = [
  {
    title: 'Track New Signups',
    description:
      'Monitor user onboarding with Clerk and trigger flows instantly.',
  },
  {
    title: 'Capture Payment Failures',
    description:
      'Get alerts for failed payments via Stripe, so nothing gets missed.',
  },
  {
    title: 'Supabase DB Monitoring',
    description:
      'Detect and respond to real-time database changes effortlessly.',
  },
  {
    title: 'Slack Notifications',
    description: 'Route only what matters to Slack. Cut through email noise.',
  },
  {
    title: 'Email Critical Events',
    description:
      'Still prefer email? Use it for critical workflows and audits.',
  },
];

export default function WebhooksPage() {
  return (
    <div className='space-y-6 px-4 md:px-10 max-w-full'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
          <p className='text-zinc-400'>
            Here's an overview of your webhook activity
          </p>
        </div>
        <PlanLimitsDialog text='Usage Limit' />
      </div>
      <div className='flex flex-col gap-4 md:flex-row'>
        <WebhookManagement />
        <div className='hidden md:flex flex-col gap-4'>
          <UseCaseCard />
        </div>
      </div>
    </div>
  );
}

function UseCaseCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % useCases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative hidden sm:block  h-max min-h-max w-[250px] p-6 rounded-xl bg-zinc-950/40  border-[0.5px] border-white/20 text-white shadow-xl overflow-hidden'>
      <div className='absolute -top-24 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-[#A692E5]/10 rounded-full blur-2xl z-0' />
      {/* Noise layers */}
      <div
        className={`absolute inset-0 opacity-50 mix-blend-overlay`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.975' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: `125px 125px`,
        }}
      />

      {/* Micro noise overlay */}
      <div
        className={`absolute inset-0 opacity-50 mix-blend-soft-light`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='microNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23microNoiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: `256px 256px`,
        }}
      />
      <div className='relative z-10 flex flex-col justify-center'>
        <div className='text-8xl font-black text-[#A692E5] -mb-4'>*</div>
        <h1 className='text-sm italic leading-tight tracking-tight text-white/60 mb-2'>
          # Use Cases
        </h1>
        <AnimatePresence mode='wait'>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className='text-3xl font-bold  text-[#c4b8e9]'>
              {useCases[index].title}
            </h3>
            <p className='text-sm text-neutral-400 mt-1'>
              {useCases[index].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className='mt-8 flex justify-center gap-2'>
        {useCases.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-[#A692E5]' : 'w-2 bg-neutral-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
