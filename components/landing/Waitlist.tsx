'use client';

import type React from 'react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';

export default function WaitlistSection() {
  return (
    <section className='py-16 md:py-20 px-6 waitlist-gradient'>
      <div className=' mx-auto max-w-4xl text-center'>
        <div className='relative p-8 md:p-12 bg-[#141418]/80 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden'>
          <div className='absolute -left-16 transform -rotate-45 bg-yellow-500 text-yellow-900 py-1 px-14 pr-20 text-sm font-semibold shadow-lg z-10'>
            20% off for waitlist
          </div>

          <div className='mt-10 md:mt-6'>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 md:glow-text'>
              Join the Waitlist
            </h2>
            <p className='text-white/70 mb-8'>
              Be the first to know when we launch new features and updates.
            </p>

            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const { error } = await response.json();
      if (!response.ok) {
        throw new Error(error.message);
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mt-10'>
      {isSuccess ? (
        <Alert className='max-w-md mx-auto bg-green-500/20 text-green-200 border-green-500/50'>
          <AlertDescription>
            <strong>Your Spot is Reserved!</strong> We're thrilled to have you
            with us and can't wait to share our exciting updates and features
            with you soon.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
            <div className='relative flex items-center'>
              <Input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='placeholder:text-sm w-full px-4 py-3 pl-6 pr-20 h-12 rounded-full border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50'
              />

              <InteractiveHoverButton
                type='submit'
                disabled={isLoading}
                className='absolute right-1 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 border-none px-6 text-xs md:text-sm'
              >
                {isLoading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <>Join Waitlist</>
                )}
              </InteractiveHoverButton>
            </div>
            {error && (
              <Alert className='max-w-md mx-auto mt-4 bg-red-500/20 text-red-200 border-red-500/50'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </>
      )}
    </div>
  );
}
