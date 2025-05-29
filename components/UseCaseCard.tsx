'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Megaphone, Zap, Slack, CreditCard, AlarmClock } from 'lucide-react';
import AnimatedListDemo from './magicui/animated-list-demo';

export const useCases = [
  {
    icon: Megaphone,
    title: 'Track New User Signups',
    description:
      'Instantly trigger workflows when a user signs up via Supabase or Clerk.',
    features: [
      'New User Signup alert triggers',
      'Track Supabase or Clerk Auth',
    ],
    color: '#A692E5',
    size: 'large',
    background: (
      <AnimatedListDemo className='absolute right-2 top-14 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90' />
    ),
  },
  {
    icon: AlarmClock,
    title: 'Trigger Cron Based Alerts',
    description:
      'Send Slack or email alerts based on scheduled conditions perfect for background checks or usage limits.',
    features: ['Time based logic', 'Custom cron rules'],
    color: '#FFD580',
    size: 'medium',
  },
  {
    icon: CreditCard,
    title: 'Stripe Payment Failures',
    description:
      'Get notified instantly when a subscription payment fails or renews, reduce churn proactively.',
    features: ['Instant failure alerts', 'Revenue protection'],
    color: '#FECACA',
    size: 'medium',
  },
  {
    icon: Slack,
    title: 'Cut Through Email Noise',
    description:
      'Route critical alerts to Slack instead of cluttered inboxes respond faster and reduce friction.',
    features: ['Slack first delivery', 'Instant team visibility'],
    color: '#C4B5FD',
    size: 'small',
  },
];

export function UseCaseCard({
  useCase,
  index,
}: {
  useCase: (typeof useCases)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = useCase.icon;
  return (
    <div className='relative h-full  max-w-xs   overflow-hidden transition-all duration-300'>
      {/* Subtle background glow */}
      <motion.div
        className='absolute -top-12 left-1/2 -translate-x-1/2 w-[120px] h-[120px] rounded-full blur-2xl'
        style={{ backgroundColor: `${useCase.color}10` }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.15 : 0.1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col'>
        <motion.div
          className='flex items-center gap-2 mb-3'
          animate={{ y: isHovered ? -1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className=' rounded-lg shrink-0'
            style={{ backgroundColor: `bg-zinc-800` }}
          >
            <Icon
              className='w-5 h-5'
              style={{ color: useCase.color, strokeWidth: '1px' }}
            />
          </div>
          <div className='min-w-0'>
            <h3 className='text-base md:text-lg font-bold text-white leading-tight'>
              {useCase.title}
            </h3>
          </div>
        </motion.div>

        <p className='text-zinc-400 text-sm leading-relaxed mb-4 flex-1'>
          {useCase.description}
        </p>
        <div className='hidden md:block'>{useCase.background}</div>
        <div className='space-y-1.5 mb-4'>
          {useCase?.features.map((feature, idx) => (
            <motion.div
              key={idx}
              className='flex items-center gap-2 text-xs text-zinc-300'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <div
                className='w-1 h-1 rounded-full shrink-0'
                style={{ backgroundColor: useCase.color }}
              />
              {feature}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle hover border */}
      <motion.div
        className='absolute inset-0 rounded-xl border opacity-0 pointer-events-none'
        style={{ borderColor: `${useCase.color}40` }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
