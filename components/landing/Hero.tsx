'use client';
import { BarChart3, CircleGauge } from 'lucide-react';
import { WaitlistForm } from './Waitlist';
import { Badge } from '../ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Ripple } from '../magicui/ripple';
import { NoiseGradientBackground } from 'noise-gradient-bg';
import localFont from 'next/font/local';

// Using local fonts for a more unique typography
const satoshi = localFont({
  src: [
    {
      path: './fonts/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
});

export default function Hero() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToTryItYourself = () => {
    const element = document.getElementById('tryityourself');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <>
      <NoiseGradientBackground
        primaryColor='rgba(200, 70, 50, 0.2)'
        secondaryColor='rgba(255, 30, 100, 0.15)'
        tertiaryColor='rgba(40, 80, 255, 0.1)'
        primaryBlur={100}
        microNoiseSize={64}
        noiseSize={256}
        theme='purple'
        noiseOpacity={60}
        microNoiseOpacity={40}
        vignetteIntensity='strong'
      />
      <section className='pt-52 pb-16 md:pb-8 px-4 overflow-hidden min-h-screen  relative z-2  '>
        <div className='absolute inset-0 z-0'>
          <Ripple mainCircleSize={400} mainCircleOpacity={0.1} numCircles={7} />
        </div>
        <div className='px-2 m-auto   max-w-6xl relative'>
          <div className='text-center max-w-4xl mx-auto'>
            <Badge
              variant={'default'}
              className='mb-4 bg-white/10 text-white/80 shadow-md hover:bg-white/10 text-xs sm:text-sm px-2 py-1 sm:px-3'
            >
              <Sparkles className='w-4 h-4  text-purple-400 mr-2' />
              <span className='text-purple-400 mr-1 '>Simplifying Alerts:</span>
              <span className='hidden sm:inline'>No Code, Just Hook it</span>
              <span className='sm:hidden'>Just Hook it</span>
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.2] tracking-[-0.02em] font-light'
            >
              <span className='text-white'>Transform</span>
              <span className='relative mx-2 text-purple-400'>
                events
                <svg
                  className='absolute -bottom-1 left-0 w-full'
                  height='4'
                  viewBox='0 0 300 4'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M1 2C75 1 225 3 299 2'
                    stroke='#a855f7'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
              <div className='flex items-center justify-center gap-3 my-2'>
                <span className='text-white'>into</span>
                <ArrowRight className='w-8 h-8 text-purple-400' />
                <span className='text-purple-400'>real-time</span>
              </div>
              <span className='text-white block mt-1'>notifications</span>
            </motion.h1>

            <p className='mt-6 text-md md:text-xl leading-6 md:leading-8 text-gray-600 dark:text-gray-400 max-w-md sm:max-w-2xl mx-auto'>
              Capture events from multiple platforms and instantly relay
              notifications across various channels with our robust webhook
              infrastructure.
            </p>

            <WaitlistForm />
            {/* <div className='flex items-center justify-center gap-4 mt-8'>
              <Button
                onClick={scrollToTryItYourself}
                size={'sm'}
                className='group'
              >
                Try it yourself
                <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size={'sm'}
                    className='bg-transparent p-4'
                  >
                    <Play className='h-4 w-4 ' />
                    View demo
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-3xl bg-zinc-900/95 border-purple-500/20 backdrop-blur-xl'>
                  <div className='aspect-video w-full overflow-hidden rounded-lg'>
                    <video
                      className='w-full h-full object-cover'
                      controls
                      autoPlay={isDialogOpen}
                      src=''
                      poster='/video-thumbnail.jpg'
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </DialogContent>
              </Dialog>
            </div> */}
            {/* Animated data points */}
            {/* Time savings data point */}
            <div className='relative z-10 mt-16 md:mt-20 w-full '>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0 max-w-md m-auto'>
                {/* <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -50,
                  }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='rounded-lg bg-gradient-to-b from-zinc-700/40 to-transparent p-4 backdrop-blur-sm text-left'
                >
                  <div className='flex items-center gap-2 text-purple-400'>
                    <Clock className='h-4 w-4' />
                    <span className='text-xs font-medium'>time saved</span>
                  </div>
                  <div className='mt-1 flex items-baseline gap-1'>
                    <span className='text-3xl font-bold text-white flex-wrap'>
                      95%
                    </span>
                    <span className='text-sm text-purple-300'>faster</span>
                  </div>
                  <div className='mt-1 text-xs text-purple-200'>
                    vs. manual integration
                  </div>
                </motion.div> */}

                {/* Efficiency data point */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 50,
                  }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className='rounded-lg  bg-gradient-to-b from-zinc-800/40 to-transparent p-4 backdrop-blur-sm text-left'
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

                {/* Success rate data point */}
                {/* <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : 50,
                  }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className='rounded-lg bg-gradient-to-b from-zinc-700/40 to-transparent p-4 backdrop-blur-sm text-left'
                >
                  <div className='flex items-center gap-2 text-purple-400'>
                    <ArrowUpRight className='h-4 w-4' />
                    <span className='text-xs font-medium'>Core Objective</span>
                  </div>
                  <div className='mt-1 flex items-baseline gap-1'>
                    <span className='text-3xl font-bold text-white'>Focus</span>
                  </div>
                  <div className='mt-1 text-xs text-purple-200'>
                    on What Matters to you, we'll handle the alerts.
                  </div>
                </motion.div> */}

                {/* Integration speed data point */}
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
