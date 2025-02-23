'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  return (
    <div className='fixed w-full z-50 px-4 pt-4'>
      <nav className='floating-nav'>
        <div className='container mx-auto h-16 flex items-center justify-between px-4 md:px-6'>
          <Link href='/' className='flex items-center space-x-2'>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-purple-300 to-purple-600'
            >
              SuperHook
            </motion.span>
          </Link>

          <div className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
            >
              Home
            </Link>
            <Link
              href='/features'
              className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
            >
              Features
            </Link>
            <Link
              href='/pricing'
              className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
            >
              Pricing
            </Link>
            <Link
              href='/docs'
              className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
            >
              Documentation
            </Link>
          </div>
          {!isAuthPage && (
            <div className='flex items-center space-x-4'>
              <Button
                variant='outline'
                className=' bg-white/5 border-white/10 text-white hover:bg-white/10'
                size='sm'
                asChild
              >
                <Link href='/sign-in'>Log in</Link>
              </Button>
              <Button
                size='sm'
                className='bg-gradient-to-tr from-purple-400 to-purple-600 text-white hidden md:flex'
                asChild
              >
                <Link href='/sign-up'>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
