import { ArrowRight } from 'lucide-react';
import { WaitlistForm } from './Waitlist';
import { Badge } from '../ui/badge';
import { Sparkles } from 'lucide-react';

export default function Hero() {
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

      <section className='pt-48 md:pt-48 pb-16 md:pb-8 px-4 overflow-hidden  relative z-2 '>
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
            <h1 className='text-5xl  tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
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
            {/* <div className='mt-10 flex justify-center gap-x-6'>
              <Button
                size='lg'
                className='bg-gradient-to-tr from-purple-400 to-purple-700 text-white'
              >
                Get Started
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
              <WaitlistForm/>
              <Button size='lg' variant='outline'>
                View Demo
              </Button>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
