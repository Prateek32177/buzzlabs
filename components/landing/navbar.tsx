'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import Link from 'next/link';
import { SignInDialog } from '@/components/auth/SIgnInDialog';

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
                  className='text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
                  size='sm'
                  asChild
                >
                  <Link href='https://docs.hookflo.com'>Docs</Link>
                </Button>
                <Button
                  variant='ghost'
                  className='text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 hidden sm:flex'
                  size='sm'
                  asChild
                >
                  <Link href='/sign-up'>Sign up</Link>
                </Button>

                <SignInDialog>
                  <button className='relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 text-xs'>
                    {/* Animated Border */}
                    <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#d3baff_0%,#5a55e0_50%,#d3baff_100%)]' />

                    {/* Inner Button */}
                    <span className='relative inline-flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-zinc-900 to-zinc-800 px-4 py-1.5 text-xs font-semibold text-zinc-100 backdrop-blur-xl'>
                      Start free trial
                    </span>
                  </button>
                </SignInDialog>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
