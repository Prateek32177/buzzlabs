import { AppSidebar } from '@/components/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import {
  TooltipProvider,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

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
        <div className='max-w-[100vw] w-full px-4 my-8 mx-auto'>{children}</div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href='https://discord.gg/SNmCjU97nr'
                target='_blank'
                rel='noopener noreferrer'
                className='fixed bottom-4 right-4 inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#C4B5FD] hover:bg-[#B4A5ED] shadow-lg'
              >
                <HelpCircle className='h-5 w-5 text-[#17171F]' />
              </a>
            </TooltipTrigger>
            <TooltipContent
              side='left'
              className='bg-[#252530] text-white border-[#353545]'
            >
              <p>Need support?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
