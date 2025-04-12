import { cn } from '@/lib/utils';
import { DotPattern } from '@/components/magicui/dot-pattern';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex max-w-7xl flex-col items-start gap-12 m-auto'>
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
