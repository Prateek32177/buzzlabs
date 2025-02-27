import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/landing/navbar';
import { Badge } from '../ui/badge';
import { ArrowRight, Sparkles, Bell, Shield, Puzzle, Cpu } from 'lucide-react';
import Introduction from './Introduction';
import WaitlistSection from './Waitlist';
import IntegrationSection from './inetgration';
import { Logo } from '../Logo';
import { WaitlistForm } from './Waitlist';

const Index = () => {
  return (
    <div className='min-h-screen   text-white w-full'>
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

      <Navbar />
      {/* Hero Section */}
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
      <Introduction />

      {/* Features Section */}
      <section className='py-16 md:py-20 px-4 gradient-background'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12 md:mb-16'>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 '>
              Powerful Features
            </h2>
            <p className='text-white/70 max-w-2xl mx-auto'>
              Discover how SuperHook can transform your event-driven
              architecture
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8'>
            {[
              {
                icon: Bell,
                title: 'Instant Notifications',
                description: 'Send real-time alerts across multiple channels',
              },
              {
                icon: Shield,
                title: 'Secure & Reliable',
                description:
                  'Enterprise-grade security for your webhook infrastructure',
              },
              {
                icon: Puzzle,
                title: 'Easy Integration',
                description: 'Seamlessly connect with your existing tech stack',
              },
              {
                icon: Cpu,
                title: 'Logging & Monitoring',
                description: 'Monitor all notifications from one place',
              },
            ].map((feature, i) => (
              <div key={i} className='feature-card'>
                <feature.icon className='w-6 h-6 md:w-8 md:h-8 text-purple-400 mb-4' />
                <h3 className='text-lg md:text-xl font-medium mb-2 text-white'>
                  {feature.title}
                </h3>
                <p className='text-white/70 text-sm md:text-base'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='relative'>
        <div className='aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-black/40 border border-white/10 shadow-xl'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center'>
                <ArrowRight className='h-8 w-8 text-white' />
              </div>
              <p className='text-white/80'>Interactive Demo</p>
              <span className='ml-2 text-xs font-semibold text-yellow-400 bg-yellow-100/5 px-2 py-1 rounded'>
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl'></div>
        <div className='absolute -bottom-8 -left-8 w-40 h-40 bg-purple-700/10 rounded-full blur-xl'></div>
      </div>
      {/* Integrations */}
      <section className='py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-black to-gray-900'>
        <div className='grid-pattern' />
        <div>
          <div className='text-center '>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 '>
              Powerful Integrations
            </h2>
            <p className='text-white/70 max-w-2xl mx-auto'>
              Connect SuperHook with your favorite tools and services
            </p>
          </div>
          <IntegrationSection />
        </div>
      </section>

      {/* How it Works */}
      <section className='py-20 px-4 relative bg-[#080809]'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-6xl font-bold mb-4 hero-text-gradient'>
              How It Works
            </h2>
            <p className='text-white/70 max-w-2xl mx-auto text-lg'>
              Capture events and send notifications in three simple steps
            </p>
          </div>

          <div className='steps-container'>
            <div className='connecting-line'></div>
            <div className='grid md:grid-cols-3 gap-8'>
              {[
                {
                  step: 1,
                  title: 'Set up and get organized',
                  description:
                    'Connect SuperHook with your existing systems in minutes',
                },
                {
                  step: 2,
                  title: 'Monitor progress',
                  description:
                    'Set up event triggers and notification channels effortlessly',
                },
                {
                  step: 3,
                  title: 'Stay on track',
                  description:
                    'Automatically receive notifications when events occur',
                },
              ].map(item => (
                <div key={item.step} className='step-card group'>
                  <div className='step-number border'>{item.step}</div>
                  <h3 className='step-heading text-lg md:text-xl font-medium mb-2 text-white'>
                    {item.title}
                  </h3>
                  <p className='step-description text-white/70 text-sm md:text-base'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaitlistSection />

      {/* Footer */}
      <footer className='bg-[#0A0A0B] py-20 px-4 border-t border-white/5 gradient-background'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='mb-4'>
                <Logo size='text-2xl' />
              </div>
              <p className='text-white/70'>
                Building the future of notification webhook infrastructure
              </p>
            </div>

            {/* {[
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
              },
            ].map(section => (
              <div key={section.title}>
                <h3 className='font-medium mb-4 text-white'>{section.title}</h3>
                <ul className='space-y-2'>
                  {section.links.map(link => (
                    <li key={link}>
                      <a
                        href='#'
                        className='text-white/70 hover:text-white transition-colors'
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))} */}
          </div>

          <div className='border-t border-white/5 pt-8'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              <p className='text-white/70'>
                © 2025 Superhook. All rights reserved.
              </p>
              <div className='flex gap-6'>
                <a
                  href='#'
                  className='text-white/70 hover:text-white transition-colors'
                >
                  Privacy Policy
                </a>
                <a
                  href='#'
                  className='text-white/70 hover:text-white transition-colors'
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
