'use client';

import { SiteHeader } from './site-header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Footer } from './footer';
import Hero from './Hero';
import Features from './Features';
import Integrations from './Integrations';
import Waitlist from './Waitlist';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className='relative flex min-h-screen flex-col items-center'>
      <SiteHeader />
      <main className='flex-1'>
        <Hero />

        <Features />

        <Integrations />

        <section id='how-it-works' className='py-20'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='max-w-3xl mx-auto text-center'
            >
              <h2 className='text-3xl font-bold sm:text-4xl mb-4'>
                How It Works
              </h2>
              <p className='text-xl text-gray-600 dark:text-gray-400 mb-8'>
                Capture events and send notifications in three simple steps
              </p>
            </motion.div>
            <div className='grid md:grid-cols-3 gap-8 mt-12'>
              {[
                {
                  title: 'Connect',
                  description:
                    'Integrate WebhookPro with your existing systems',
                },
                {
                  title: 'Configure',
                  description:
                    'Set up event triggers and notification channels',
                },
                {
                  title: 'Capture & Notify',
                  description:
                    'Automatically send notifications when events occur',
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className='text-center'
                >
                  <div className='w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                    {index + 1}
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>{step.title}</h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Waitlist />

        <section className='py-20'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center'
            >
              <h2 className='text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl'>
                Ready to get started?
              </h2>
              <p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
                Start capturing events and sending notifications in minutes. No
                credit card required.
              </p>
              <Button
                size='lg'
                className='mt-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white'
              >
                Get Started Now
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
