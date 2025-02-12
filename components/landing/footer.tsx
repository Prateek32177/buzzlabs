import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ThemeSwitcher } from '../theme-switcher';

export function Footer() {
  return (
    <footer className='border-t bg-background'>
      <ThemeSwitcher />
      <div className='container flex flex-col gap-10 py-16'>
        <div className='grid grid-cols-2 gap-12 md:grid-cols-4'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold'>Product</h3>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Features
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Pricing
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Changelog
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Documentation
            </Link>
          </div>
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold'>Company</h3>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              About
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Blog
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Careers
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Contact
            </Link>
          </div>
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold'>Legal</h3>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Privacy
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Terms
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Cookie Policy
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Licenses
            </Link>
          </div>
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold'>Social</h3>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Twitter
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              GitHub
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Discord
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <Separator />
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <p className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Quinx. All rights reserved.
          </p>
          <div className='flex gap-4'>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Privacy Policy
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
