import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className='relative overflow-hidden pt-36 pb-20'>
      <div className='z-[-10] fixed inset-0 overflow-hidden' aria-hidden='true'>
        <div
          className='absolute inset-0 opacity-20 mix-blend-overlay'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.975' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />
        <div
          className='absolute inset-0 opacity-10 mix-blend-soft-light'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='microNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23microNoiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        <div className='absolute top-0 left-0 w-full to-transparent h-full'>
          <div
            className={`absolute inset-0 bg-gradient-to-b from-emerald-300/20 via-emerald-500/15 to-transparent`}
            style={{
              filter: 'blur(80px)',
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-b from-emerald-400/15 via-emerald-500/10 to-transparent`}
            style={{
              filter: 'blur(60px)',
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent`}
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
                        transparent 30%,
                        rgba(24, 24, 27, 0.4) 50%,
                        rgba(24, 24, 27, 0.8) 100%
                      )
                    `,
            }}
          />
        </div>

        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/10 to-zinc-900/30' />
      </div>

      <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mx-auto max-w-4xl text-center'
        >
          <h1 className='text-4xl  tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
            Capture Events,{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400'>
              Send Notifications
            </span>
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl max-w-2xl mx-auto'>
            SuperHook provides a robust webhook infrastructure to capture change
            events and send instant notifications across multiple channels.
          </p>
          <div className='mt-10 flex justify-center gap-x-6'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-blue-500 to-teal-400 text-white'
            >
              Get Started
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
            <Button size='lg' variant='outline'>
              View Demo
            </Button>
          </div>
        </motion.div>
      </div>
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>
    </section>
  );
}
