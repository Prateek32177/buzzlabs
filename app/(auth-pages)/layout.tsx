import { cn } from '@/lib/utils';
import { DotPattern } from '@/components/magicui/dot-pattern';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex max-w-7xl flex-col items-start gap-12 m-auto'>
      <nav className='w-full mb-6'>
        <Link
          href={'/'}
          className='z-10  absolute left-4 top-4 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm'
        >
          <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Home
        </Link>
      </nav>
      <DotPattern
        glow={true}
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
        )}
      />
      {children}
    </div>
  );
}
