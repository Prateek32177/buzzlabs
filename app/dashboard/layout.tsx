import { AppSidebar } from '@/components/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar
        side='left'
        variant='inset'
        collapsible='icon'
        className='sidebar-background'
      />
      <SidebarInset>
        <div className='max-[768px]:block hidden '>
          <SidebarTrigger className='ml-4' />
        </div>
        <div className='mx-4 my-8'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
