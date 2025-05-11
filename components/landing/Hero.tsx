'use client';
import React, { useState, useEffect } from 'react';
import { BarChart3, GaugeCircle as CircleGauge, Sparkles } from 'lucide-react';
import { WaitlistForm } from './Waitlist';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { Ripple } from '../magicui/ripple';
import { NoiseGradientBackground } from 'noise-gradient-bg';
import { CountdownTimer } from './CountdownTimer';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <NoiseGradientBackground
        theme='custom'
        noiseOpacity={30}
        primaryBlur={50}
        vignetteIntensity='strong'
        style={{
          background:
          'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.6), transparent 90%)',
        }}
      />
      <section className='pt-44 pb-16 md:pb-8 px-4 overflow-hidden min-h-screen relative z-2'>
        <div className='absolute inset-0 z-0'>
          <Ripple mainCircleSize={400} mainCircleOpacity={0.1} numCircles={7} />
        </div>
        <div className='px-2 m-auto max-w-6xl relative'>
          <div className='text-center max-w-4xl mx-auto'>
            {/* <Badge
              variant={'secondary'}
              className='mb-4 text-white/80 text-xs px-3 py-2 sm:px-3 
          border border-purple-500/20 bg-zinc-900/50 
          backdrop-blur-sm shadow-lg
          hover:border-purple-500/40 hover:bg-zinc-900/60
          transition-all duration-300 ease-in-out
          rounded-full'
            >
              <Sparkles className='w-4 h-4 text-purple-400 fill-purple-400 mr-2' />
              <span className='text-purple-300'>Simplifying Alerts</span>
              <span className='ml-1 text-white/80 hidden sm:inline'>
                No Code, Just Hook It
              </span>
              <span className='sm:hidden'>Just Hook it</span>
            </Badge> */}

            <CountdownTimer compact />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-[2.5rem] lg:text-[4rem] leading-[1] tracking-tighter font-light`}
            >
              <span className='text-white'>Transform</span>
              <span className='relative mx-2 bg-gradient-to-r from-[#FFE599] to-[#FFD866] text-transparent bg-clip-text font-light'>
                events
              </span>
              <div className='flex items-center justify-center gap-3 my-2'>
                <span className='text-white font-light'>into</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-8 h-8 text-purple-400'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
                  />
                </svg>
                <span className='bg-gradient-to-r from-[#FFE599] to-[#FFD866] text-transparent bg-clip-text'>
                  real-time
                </span>
              </div>
              <span className='text-white block mt-1'>notifications</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='mt-6 text-base md:text-lg leading-7 md:leading-8 
          tracking-wide font-light
          bg-gradient-to-br from-white/50 to-white/60 text-transparent bg-clip-text
          max-w-sm sm:max-w-2xl mx-auto'
            >
              Capture events from multiple platforms and instantly relay
              notifications across various channels with our robust webhook
              infrastructure.
            </motion.p>

            <WaitlistForm />
            <div className='relative z-10 mt-10 md:mt-14 w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0 max-w-md m-auto'>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 50,
                  }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className='rounded-lg bg-gradient-to-b from-zinc-800/40 to-transparent p-4 backdrop-blur-sm text-left'
                >
                  <div className='flex items-center gap-2 text-purple-400'>
                    <CircleGauge className='h-4 w-4' />
                    <span className='text-xs font-medium'>efficiency</span>
                  </div>
                  <div className='mt-1 flex items-baseline gap-1 flex-wrap'>
                    <span className='text-2xl md:text-3xl font-bold text-white'>
                      No-code
                    </span>
                  </div>
                  <div className='mt-1 text-xs text-purple-200'>
                    direct alert configuration from dashboard
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : -50,
                  }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  className='rounded-lg bg-gradient-to-b from-zinc-700/40 to-transparent p-4 backdrop-blur-sm text-left'
                >
                  <div className='flex items-center gap-2 text-purple-400'>
                    <BarChart3 className='h-4 w-4' />
                    <span className='text-xs font-medium'>integration</span>
                  </div>
                  <div className='mt-1 flex items-baseline gap-1'>
                    <span className='text-2xl md:text-3xl font-bold text-white'>
                      in 5 mins
                    </span>
                  </div>
                  <div className='mt-1 text-xs text-purple-200'>
                    Instead of days spent on custom integration
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
