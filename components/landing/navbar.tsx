'use client';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import { ChevronsRight } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  return (
    <div className='fixed w-full z-50'>
      {/* Main Navbar */}
      <div className='px-6 md:px-16 pt-4'>
        <nav className='floating-nav'>
          <div className='container mx-auto h-16 flex items-center justify-between px-4 md:px-6'>
            <Logo size='xl' hideText={true} />
            {!isAuthPage && (
              <div className='flex items-center space-x-2'>
                <Button
                  variant='ghost'
                  className='text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex'
                  size='sm'
                  asChild
                >
                  <Link href='/sign-up'>Sign up</Link>
                </Button>
                <Button
                  size='sm'
                  className='bg-white/80 text-gray-800 border-none'
                  asChild
                >
                  <Link href='/sign-in' className='flex items-center group'>
                    Get Started
                    <ChevronsRight className='-ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-zinc-700' />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
