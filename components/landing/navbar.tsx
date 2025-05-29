'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import Link from 'next/link';
import { SignInDialog } from '../auth/SignInDialog';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  return (
    <div className='fixed z-50 w-full'>
      <div className='px-6 pt-4 md:px-16'>
        <nav className='floating-nav'>
          <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
            <Logo size='xl' hideText={true} />
            {!isAuthPage && (
              <div className='flex items-center gap-2 sm:gap-3'>
                <Button
                  variant='ghost'
                  className='text-white/70 hover:text-white hover:bg-white/10'
                  size='sm'
                  asChild
                >
                  <Link href='https://docs.hookflo.com'>Docs</Link>
                </Button>
                <Button
                  variant='ghost'
                  className='text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex'
                  size='sm'
                  asChild
                >
                  <Link href='/sign-up'>Sign up</Link>
                </Button>

                <SignInDialog>
                  <Button
                    size='sm'
                    className='bg-[#f5f3ff] text-zinc-900 hover:bg-white border border-zinc-300 shadow-sm transition-colors'
                  >
                    Start free trial
                  </Button>
                </SignInDialog>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
