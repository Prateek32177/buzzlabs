'use client';
import { motion } from 'framer-motion';

const GlowingAsterisk = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='fill-purple-400'
  >
    <path d='M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z' />
  </svg>
);

export default function Introduction() {
  return (
    <div className=' text-gray-100  py-12 px-8 lg:px-8 flex items-center justify-center overflow-hidden'>
      <div className='max-w-3xl mx-auto text-center relative z-10'>
        <motion.div
          className='flex items-center justify-center mb-12'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlowingAsterisk />
          <span className='text-purple-300 uppercase text-sm font-bold tracking-[0.2em] ml-3'>
            Introducing Hookflo
          </span>
        </motion.div>
        <motion.h1
          className='text-2xl md:text-4xl leading-none tracking-tight mb-8'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className='text-white font-medium'>
            Supercharge your database, payment subscriptions, auth event
            monitoring with Hookflo.
          </span>{' '}
          <span className='text-gray-400 font-light'>
            The seamless way to stay in sync with your data's pulse.{' '}
          </span>
          <span className='text-gray-500'>
            Get instant Slack and email notifications for any event trigger with
            just a few clicks.{' '}
          </span>
          <span className='text-white'>
            Zero complexity, lightning-fast setup, No library installation and
            Instant alerts make tracking any change event activity effortless.
          </span>
        </motion.h1>
      </div>
    </div>
  );
}
