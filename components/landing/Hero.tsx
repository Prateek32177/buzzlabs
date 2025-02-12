import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className='relative overflow-hidden pt-36 pb-20'>
      <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mx-auto max-w-4xl text-center'
        >
          <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
            Capture Events,{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400'>
              Send Notifications
            </span>
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl max-w-2xl mx-auto'>
            WebhookPro provides a robust webhook infrastructure to capture
            change events and send instant notifications across multiple
            channels.
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
