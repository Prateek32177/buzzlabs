'use client';
import { ArrowRight, Clock, BarChart3, ArrowUpRight } from 'lucide-react';
import { WaitlistForm } from './Waitlist';
import { Badge } from '../ui/badge';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Ripple } from '../magicui/ripple';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

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
      <div className='fixed inset-0 overflow-hidden ' aria-hidden='true'>
        <div
          className='absolute inset-0 opacity-60 mix-blend-overlay'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.975' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />
        <div
          className='absolute inset-0 opacity-40 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='microNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23microNoiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        <div className='absolute top-0 left-0 w-full to-transparent h-full'>
          <div
            className={`absolute inset-0 bg-gradient-to-b from-purple-300/20 via-purple-500/15 to-transparent`}
            style={{
              filter: 'blur(80px)',
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-b from-purple-400/15 via-purple-500/10 to-transparent`}
            style={{
              filter: 'blur(60px)',
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent`}
            style={{
              filter: 'blur(40px)',
            }}
          />

          <div
            className='absolute inset-0'
            style={{
              background: `
                radial-gradient(
                  80% 100% at 50% 0%,
                  transparent 10%,
                  rgba(0, 0, 0, 0.4) 40%,
                  rgba(1, 1, 2, 0.8) 60%
                )
              `,
            }}
          />
        </div>

        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/10 to-zinc-900/30' />
      </div>

      <section className='pt-40 pb-16 md:pb-8 px-4 overflow-hidden min-h-screen  relative z-2  '>
        <div className='absolute inset-0 z-0'>
          <Ripple mainCircleSize={400} mainCircleOpacity={0.1} numCircles={7} />
        </div>
        <div className='container   max-w-6xl relative'>
          <div className='text-center max-w-4xl mx-auto'>
            <Badge
              variant={'default'}
              className='mb-4 bg-white/10 text-white/80 shadow-md hover:bg-white/10'
            >
              <Sparkles className='w-4 h-4 text-purple-400 mr-2' />
              <span className='text-purple-400 mr-1'>
                Simplifying Alerts:
              </span>{' '}
              No Code, Just Connect it
              <ArrowRight className='ml-1 h-3 w-3' />
            </Badge>
            <h1 className='tracking-tight text-4xl md:text-6xl lg:text-7xl'>
              Capture Events,{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200'>
                Send Notifications
              </span>
            </h1>
            <p className='mt-6 text-md md:text-xl leading-6 md:leading-8 text-gray-600 dark:text-gray-500  max-w-2xl mx-auto'>
              SuperHook provides a robust webhook infrastructure to capture
              change events and send instant notifications across multiple
              channels.
            </p>
            <WaitlistForm />
            <div className='flex items-center justify-center gap-4 mt-8'>
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
            </div>
            {/* Animated data points */}
            {/* Time savings data point */}
            <div className='relative z-10 mt-16 md:mt-24'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0'>
                <motion.div
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
                </motion.div>

                {/* Efficiency data point */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 50,
                  }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className='rounded-lg  bg-gradient-to-b from-zinc-700/40 to-transparent p-4 backdrop-blur-sm text-left'
                >
                  <div className='flex items-center gap-2 text-purple-400'>
                    <BarChart3 className='h-4 w-4' />
                    <span className='text-xs font-medium'>
                      platform efficiency
                    </span>
                  </div>
                  <div className='mt-1 flex items-baseline gap-1 flex-wrap'>
                    <span className='text-3xl font-bold text-white'>99.8%</span>
                    <span className='text-sm text-purple-300'>uptime</span>
                  </div>
                  <div className='mt-1 text-xs text-purple-200'>
                    enterprise-grade reliability
                  </div>
                </motion.div>

                {/* Success rate data point */}
                <motion.div
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
                </motion.div>

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
                    <span className='text-xs font-medium'>
                      integration speed
                    </span>
                  </div>
                  <div className='mt-1 flex items-baseline gap-1'>
                    <span className='text-3xl font-bold text-white'>
                      in 5 mins
                    </span>
                  </div>
                  <div className='mt-1 text-xs text-purple-200'>
                    vs 7 days manual alert setup
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
