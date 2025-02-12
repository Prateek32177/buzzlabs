'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className='fixed top-4 transform -translate-x-1/2 z-50 w-11/12 max-w-7xl'
    >
      <div className='rounded-full bg-white/80 shadow-lg backdrop-blur-md'>
        <div className='container flex h-16 items-center justify-between px-8'>
          <Link href='/' className='flex items-center space-x-2'>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400'
            >
              WebhookPro
            </motion.span>
          </Link>
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='#features'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Features
            </Link>
            <Link
              href='#integrations'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Integrations
            </Link>
            <Link
              href='#how-it-works'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              How It Works
            </Link>
          </nav>
          {!isAuthPage && (
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='sm' asChild>
                <Link href='/sign-in'>Log in</Link>
              </Button>
              <Button
                size='sm'
                className='bg-gradient-to-r from-blue-500 to-teal-400 text-white'
                asChild
              >
                <Link href='/sign-up'>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
