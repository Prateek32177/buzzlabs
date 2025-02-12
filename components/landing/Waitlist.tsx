'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Waitlist() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup logic here
    console.log('Signed up with email:', email);
    setEmail('');
  };

  return (
    <section className='py-20 bg-gradient-to-r from-blue-500 to-teal-400'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='max-w-3xl mx-auto text-center'
        >
          <h2 className='text-3xl font-bold sm:text-4xl mb-4 text-white'>
            Join the Waitlist
          </h2>
          <p className='text-xl mb-8 text-white'>
            Be the first to know when we launch new features and updates.
          </p>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col sm:flex-row gap-4 justify-center'
          >
            <Input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='bg-white text-gray-900 placeholder-gray-500'
            />
            <Button
              type='submit'
              size='lg'
              className='bg-gray-900 hover:bg-gray-800 text-white'
            >
              Join Waitlist
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
