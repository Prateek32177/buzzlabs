'use client';

import type React from 'react';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
    setEmail('');
  };

  return (
    <section className='py-16 md:py-20 px-4 waitlist-gradient'>
      <div className='container mx-auto max-w-4xl text-center'>
        <div className='relative p-8 md:p-12 bg-[#141418]/80 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden'>
          <div className='absolute  -left-16 transform -rotate-45 bg-yellow-500 text-yellow-900 py-1 px-14 pr-20 text-sm font-semibold shadow-lg z-10'>
            20% off for waitlist
          </div>

          <div className='mt-8 md:mt-6'>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 glow-text'>
              Join the Waitlist
            </h2>
            <p className='text-white/70 mb-8'>
              Be the first to know when we launch new features and updates.
            </p>

            {isSuccess ? (
              <Alert className='max-w-md mx-auto bg-green-500/20 text-green-200 border-green-500/50'>
                <AlertDescription>
                  Thanks for joining! We'll keep you updated.
                </AlertDescription>
              </Alert>
            ) : (
              <form
                onSubmit={handleSubmit}
                className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'
              >
                <Input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/20'
                />
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='bg-purple-600 text-white hover:bg-purple-700 border border-purple-400/20'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Please wait
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
