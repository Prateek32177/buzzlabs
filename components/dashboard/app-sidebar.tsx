'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  LayoutPanelTop,
  Mails,
  SlackIcon,
} from 'lucide-react';
import { Logo } from '../Logo';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Manage Webhooks',
      url: '/dashboard/webhooks',
      icon: LayoutPanelTop,
      active: true,
    },
    {
      title: 'Notification Logs',
      url: '/dashboard/logs',
      icon: Bot,
    },
    {
      title: 'Email Templates',
      url: '/dashboard/email-templates',
      icon: Mails,
    },
    {
      title: 'Slack Templates',
      url: '/dashboard/slack-templates',
      icon: SlackIcon,
    },
    {
      title: 'Integration Guide',
      url: '/dashboard/integration-guide',
      icon: BookOpen,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { state } = useSidebar();
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='flex justify-center items-left w-full h-full my-4'>
          {state === 'collapsed' ? (
            <div
              className='text-2xl font-bold    animate-fade-in
          relative
          z-20
          bg-gradient-to-r from-purple-600 to-rose-300
          text-transparent
          bg-clip-text'
            >
              H
            </div>
          ) : (
            <div className='w-full px-2'>
              <Logo size='2xl' />
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.email?.split('@')[0] || '',
              email: user.email || '',
              avatar:
                'https://api.dicebear.com/9.x/adventurer/svg?seed=Brian&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede',
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
