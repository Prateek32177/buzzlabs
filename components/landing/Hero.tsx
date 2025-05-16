'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  GaugeCircle as CircleGauge,
  ChevronsUp,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Ripple } from '../magicui/ripple';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { NoiseGradientBackground } from 'noise-gradient-bg';

export default function Hero() {
  const [gradientIndex, setGradientIndex] = useState(0);

  const gradients = [
    'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.35) 0%, rgba(88, 28, 135, 0.2) 50%, rgba(24,24,27,1) 100%)', // Purple
    'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.3) 0%, rgba(202, 138, 4, 0.15) 50%, rgba(24,24,27,1) 100%)', // Amber-Gold
    'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.28) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(24,24,27,1) 100%)', // Emerald Green
    'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.28) 0%, rgba(2, 132, 199, 0.15) 50%, rgba(24,24,27,1) 100%)', // Sky Blue
    'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.28) 0%, rgba(190, 24, 93, 0.15) 50%, rgba(24,24,27,1) 100%)', // Pink Rose
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex(prev => (prev + 1) % gradients.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className='relative min-h-screen overflow-hidden bg-zinc-950 flex items-center justify-center px-4'>
      <div className='absolute inset-0 z-0'>
        {gradients.map((gradient, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === gradientIndex ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className='absolute inset-0'
          >
            <NoiseGradientBackground
              noiseOpacity={10}
              primaryBlur={80}
              vignetteIntensity='strong'
              style={{ background: gradient }}
              className='w-full h-full'
            />
          </motion.div>
        ))}
      </div>

      <div className='absolute inset-0 z-10 pointer-events-none'>
        <Ripple mainCircleSize={400} mainCircleOpacity={0.1} numCircles={7} />
      </div>

      <section className='relative z-20 max-w-4xl w-full flex flex-col items-center text-center py-28 px-2'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6'
        >
          <Badge
            variant='outline'
            className='border-zinc-800 bg-zinc-900/80 px-3 py-1.5 backdrop-blur-sm'
          >
            <ChevronsUp className='mr-1 h-4 w-4 text-[#c6c0e4]' />
            <span className='text-[#c6c0e4]'>Hookflo Public Beta</span>
            <span className='ml-1 inline text-zinc-400 sm:hidden'>is Live</span>
            <span className='ml-1 hidden text-zinc-400 sm:inline'>
              is Now Live
            </span>
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
          className='mt-6 text-sm sm:text-base font-light text-balance bg-gradient-to-br from-white/50 to-white/60 text-transparent bg-clip-text px-4 sm:px-0 max-w-md sm:max-w-lg md:max-w-xl mx-auto'
        >
          Capture events from multiple platforms and instantly relay
          notifications across various channels with our robust webhook
          infrastructure.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className='mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0'
        >
          <Link
            href='/sign-in'
            className='group inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm  text-zinc-900 transition-all duration-300 hover:bg-white/80 shadow-sm ring-1 ring-zinc-900/10 backdrop-blur-sm hover:ring-zinc-900/20'
          >
            <span className='relative z-10 flex items-center'>
              Start Tracking Events
              <ArrowUpRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </span>
          </Link>
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
