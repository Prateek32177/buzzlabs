'use client';

import React, { useState, useEffect } from 'react';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { getUser } from '@/hooks/user-auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HookfloIcon } from '../Logos/Hookflo';
// This is sample data.
const data = {
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
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      const { userEmail, username, avatar_seed } = await getUser();
      setEmail(userEmail || '');
      setUsername(username || '');
      setAvatarSeed(avatar_seed || '');
    };
    fetchUser();
  }, []);

  const { state, open } = useSidebar();
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='flex justify-center items-left w-full h-full my-4'>
          {state === 'collapsed' && !open ? (
            <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
              <HookfloIcon />

              <SidebarTrigger />
            </div>
          ) : (
            <div className='w-full flex items-center justify-between gap-2'>
              <Logo size='2xl' />
              <SidebarTrigger className='-ml-1' />
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <>
        <UsageBar
        label='Emails left'
        used={40}
        total={100}

        />
           <UsageBar
        label='Slack alerts left'
        used={40}
        total={500}

        />
        

        {email && (
          <NavUser
            user={{
              name: username || '',
              email: email || '',
              avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede`,
            }}
          />
        )}
        </>
      </SidebarFooter>
    </Sidebar>
  );
}


function UsageBar({
  label,
  used,
  total,
  colorFrom = '#d546ef', // Fuchsia-500
  colorTo = '#8b5cd6', // Violet-500
}: {
  label?: string;
  used: number;
  total: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <div className="w-full mb-2 px-4">
      {/* Label */}
      <div className="flex justify-between text-[11px] font-medium text-zinc-400 mb-1 tracking-tight">
        <span>{label}</span>
        <span className="tabular-nums">{used}/{total}</span>
      </div>

      {/* Track */}
      <div className="relative h-2.5 rounded-full bg-zinc-800/70 backdrop-blur-sm shadow-inner overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
          }}
        />
      </div>
    </div>
  );
}
