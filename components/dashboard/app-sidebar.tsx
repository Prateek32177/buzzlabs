'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bot,
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
import { useRouter } from 'next/navigation';
import { useUsageData } from '@/hooks/use-usage-data';

type UsageBarProps = {
  label?: string;
  used: number;
  total: number;
  colorFrom?: string;
  colorTo?: string;
  isCollapsed?: boolean; // whether sidebar is collapsed
};

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
  const { usageData, isLoading, error } = useUsageData();
  const [subscriptionTier, setSubscriptionTier] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { userEmail, username, avatar_seed, subscription_tier } =
        await getUser();
      setEmail(userEmail || '');
      setUsername(username || '');
      setAvatarSeed(avatar_seed || '');
      setSubscriptionTier(subscription_tier || '');
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
              <Logo size='2xl' showBeta={true} />
              <SidebarTrigger className='-ml-1' />
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className='my-2'>
        <>
          <UsageBar
            label='Emails left'
            used={usageData?.usage.current.emails || 0}
            total={usageData?.subscription.limits.dailyEmails || 0}
            isCollapsed={!open}
          />
          <UsageBar
            label='Slack alerts left'
            used={usageData?.usage.current.slackNotifications || 0}
            total={usageData?.subscription.limits.dailySlackNotifications || 0}
            isCollapsed={!open}
          />

          <NavUser
            user={{
              name: username || '',
              email: email || '',
              subscription_tier: subscriptionTier || 'Free',
              avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede`,
            }}
          />
        </>
      </SidebarFooter>
    </Sidebar>
  );
}

export function UsageBar({
  label,
  used,
  total,
  colorFrom = '#d546ef',
  colorTo = '#8b5cd6',
  isCollapsed = false,
}: UsageBarProps) {
  const router = useRouter();
  const percentage = Math.min((used / total) * 100, 100);

  const handleClick = () => {
    router.push('/dashboard/settings/usage');
  };

  return (
    <div
      onPointerUp={handleClick}
      className={`w-full px-4 mb-2 cursor-pointer group transition-opacity duration-300 ${
        isCollapsed
          ? 'opacity-0 pointer-events-none h-0 overflow-hidden'
          : 'opacity-100'
      }`}
    >
      {/* Label */}
      <div className='flex justify-between text-[11px] font-medium text-zinc-400 mb-1 tracking-tight'>
        <span>{label}</span>
        <span className='tabular-nums'>
          {used}/{total}
        </span>
      </div>

      {/* Track */}
      <div className='relative h-2.5 rounded-full bg-zinc-800/70 backdrop-blur-sm shadow-inner overflow-hidden group-hover:ring-1 group-hover:ring-zinc-600/30'>
        {/* Progress Fill */}
        <div
          className='absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-in-out'
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
          }}
        />
      </div>
    </div>
  );
}
