import { AppSidebar } from '@/components/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar
        side='left'
        collapsible='icon'
        className='sidebar-background'
      />
      <SidebarInset>
        <div className='hidden max-[768px]:block max-[768px]:sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
          <div className='flex h-14 items-center px-4'>
            <div className='flex w-full items-center justify-between'>
              <Logo size='2xl' showBeta={true} />
              <SidebarTrigger className='inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground' />
            </div>
          </div>
        </div>
        <div className='mx-4 my-8'>{children}</div>
        <a
          href='https://discord.gg/SNmCjU97nr'
          target='_blank'
          rel='noopener noreferrer'
          className='fixed bottom-4 right-4 flex items-center gap-1.5 bg-[#A692E5] text-black/80 text-xs px-3 py-1.5 rounded-full shadow-lg transition-colors'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={14}
            height={14}
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612' />
          </svg>
          Need support?
        </a>
      </SidebarInset>
    </SidebarProvider>
  );
}
