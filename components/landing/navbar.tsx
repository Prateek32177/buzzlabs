'use client';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import { ChevronsRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  const scrollToTryItYourself = () => {
    const element = document.getElementById('tryityourself');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='fixed w-full z-50'>
      {/* Main Navbar */}
      <div className='px-6 md:px-16 pt-4'>
        <nav className='floating-nav'>
          <div className='container mx-auto h-16 flex items-center justify-between px-4 md:px-6'>
            <Logo />

            {/* <div className='hidden md:flex items-center space-x-8'>
              <Link
                href='#'
                className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
              >
                Home
              </Link>
              <Link
                href='#features'
                className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
              >
                Features
              </Link>
              <Link
                href='#pricing'
                className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
              >
                Pricing
              </Link>
              <Link
                href='#docs'
                className='text-white/40 hover:text-white/90 transition-colors text-sm font-medium'
              >
                Documentation
              </Link>
            </div> */}
            {/* {!isAuthPage && (
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
            )} */}
            <Button onClick={scrollToTryItYourself} size={'sm'}>
              Try it yourself
              <ChevronsRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-zinc-700' />
            </Button>
          </div>
          {/* offer banner */}
          <div className='gap-2 px-4 py-1.5 flex items-center justify-center backdrop-blur-sm'>
            <span className='inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse'></span>
            <p className='text-xs md:text-sm text-white/90'>
              <span className='font-medium'>Pre Launch Offer:</span>{' '}
              <span className='text-yellow-400 font-bold'>20% Off</span> for
              waitlisted users
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}
