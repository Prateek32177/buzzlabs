'use client';

import {
  BarChart3,
  GaugeCircle as CircleGauge,
  ChevronsUp,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Ripple } from '../magicui/ripple';
import { Badge } from '../ui/badge';
import { NoiseGradientBackground } from 'noise-gradient-bg';
import { SupabaseLogo, ClerkLogo } from '../Logos';
import { StripeWordmarkLogo } from '@/components/Logos/StripeLogo';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { DodoLogo } from '../Logos/DodoPayments';
import { SignInDialog } from '@/components/auth/signInDialog';
import { Button } from '../ui/button';

export default function Hero() {
  const iconClasses =
    'w-6 h-6 text-zinc-400 transition-colors group-hover:text-white';

  const icons = [
    <StripeWordmarkLogo
      className={`${iconClasses}`}
      style={{
        filter: 'brightness(0) invert(0.7)',
        scale: '0.8',
      }}
    />,

    <SupabaseLogo className={`${iconClasses} -ml-6`} />,
    <DodoLogo className={`${iconClasses}`} />,
    <GitHubLogoIcon className={iconClasses} />,
    <ClerkLogo className={`${iconClasses} fill-zinc-400`} />,
  ];

  return (
    <section className='relative min-h-screen overflow-hidden bg-zinc-950 flex items-center justify-center px-4'>
      <NoiseGradientBackground
        theme='purple'
        noiseOpacity={10}
        primaryBlur={80}
        vignetteIntensity='strong'
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(147, 101, 253, 0.4) 0%, rgba(85, 60, 150, 0.2) 50%, rgba(24, 24, 27, 0.9) 100%)',
        }}
      />
      <div className='absolute inset-0 z-10 pointer-events-none'>
        <Ripple mainCircleSize={400} mainCircleOpacity={0.1} numCircles={7} />
      </div>

      <section className='relative z-20 max-w-4xl w-full flex flex-col items-center text-center pt-36 pb-16 md:pb-8 px-4'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6'
        >
          <Badge
            variant='outline'
            className='flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-100 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-zinc-600'
          >
            <ChevronsUp className='h-4 w-4 text-violet-200' />
            <span className='text-violet-200'>Hookflo Public Beta</span>
            <span className='hidden text-zinc-400 sm:inline'>is Now Live</span>
            <span className='inline text-zinc-400 sm:hidden'>is Live</span>
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className='text-center text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight text-white'
        >
          Transform{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-400'>
            events
          </span>{' '}
          into <br className='hidden sm:inline' />
          <span>real time notifications</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className='mt-4 text-sm sm:text-base  text-balance bg-gradient-to-br from-white/50 to-white/60 text-transparent bg-clip-text px-1 sm:px-0 max-w-lg md:max-w-xl mx-auto'
        >
          Capture Webhook events from multiple platforms and instantly relay
          notifications across various channels with our robust webhook
          infrastructure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className='mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0'
        >
          <SignInDialog>
            <Button
              size='sm'
              className='group inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm  text-zinc-900 transition-all duration-300 hover:bg-white/80 shadow-sm ring-1 ring-zinc-900/10 backdrop-blur-sm hover:ring-zinc-900/20'
            >
              <span className='relative z-10 flex items-center'>
                Start Tracking Events
                <ArrowUpRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </span>
            </Button>
          </SignInDialog>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className='mt-8 flex flex-col items-center gap-3'
        >
          <span className='text-sm text-zinc-500 tracking-wide'>
            Flawlessly integrates with
          </span>
          <div className='flex items-center gap-6 text-sm font-medium text-zinc-400 transition-all -ml-4'>
            {icons.map((icon, index) => (
              <span
                key={index}
                className='flex items-center gap-1 hover:text-zinc-100 transition-colors'
              >
                {icon}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className='relative z-10 mt-10 md:mt-14 w-full grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0 max-w-md m-auto'
        >
          <div className='rounded-lg border border-zinc-500/20 bg-zinc-900/50 p-4 backdrop-blur-sm text-left hover:border-zinc-500/30 hover:bg-zinc-900/60 transition-all duration-300'>
            <div className='flex items-center gap-2 text-purple-300'>
              <CircleGauge className='h-4 w-4 fill-purple-400/10' />
              <span className='text-xs font-medium tracking-wide'>
                efficiency
              </span>
            </div>
            <div className='mt-2 text-2xl md:text-3xl font-light text-white'>
              No-code
            </div>
            <div className='mt-2 text-xs text-white/60'>
              Direct alert configuration from dashboard
            </div>
          </div>

          <div className='rounded-lg border border-zinc-500/20 bg-zinc-900/50 p-4 backdrop-blur-sm text-left hover:border-zinc-500/30 hover:bg-zinc-900/60 transition-all duration-300'>
            <div className='flex items-center gap-2 text-purple-300'>
              <BarChart3 className='h-4 w-4 fill-purple-400/10' />
              <span className='text-xs font-medium tracking-wide'>
                integration
              </span>
            </div>
            <div className='mt-2 text-2xl md:text-3xl font-light text-white'>
              in 5 mins
            </div>
            <div className='mt-2 text-xs text-white/60'>
              Instead of days spent on custom integration
            </div>
          </div>
        </motion.div>
      </section>
    </section>
  );
}
