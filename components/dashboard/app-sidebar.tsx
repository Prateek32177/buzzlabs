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
import { usePathname } from 'next/navigation';

type UsageBarProps = {
  label?: string;
  used: number;
  total: number;
  colorFrom?: string;
  colorTo?: string;
  isCollapsed?: boolean;
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
      url: 'https://docs.hookflo.com',
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
  const { usageData } = useUsageData();
  const [subscriptionTier, setSubscriptionTier] = useState('');
  const pathname = usePathname();

  const navItemsWithActive = data.navMain.map(item => ({
    ...item,
    isActive: pathname === item.url,
  }));

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
    <Sidebar collapsible='icon' {...props} variant='inset'>
      <SidebarHeader>
        <div className='flex justify-center items-left w-full h-full my-4'>
          {state === 'collapsed' && !open ? (
            <div className='flex flex-col items-center justify-center w-full h-full gap-2'>
              <HookfloIcon />
              <SidebarTrigger />
            </div>
          ) : (
            <div className='w-full flex items-center justify-between gap-2'>
              <Logo size='xl' showBeta={true} />
              <div className='hidden items-center justify-center md:block'>
                <SidebarTrigger className='-ml-1' />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItemsWithActive} />
      </SidebarContent>
      <SidebarFooter className='my-2'>
        <>
          <UsageBar
            label='Daily Email alerts left'
            used={usageData?.currentUsage.dailyEmails.current || 0}
            total={usageData?.subscription.limits.dailyEmails || 0}
            isCollapsed={!open}
          />
          <UsageBar
            label='Daily Slack alerts left'
            used={usageData?.currentUsage.dailySlackNotifications.current || 0}
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
  colorFrom = '#bfaaff',
  colorTo = '#9d89ea',
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
      className={`w-full px-2 mb-2 cursor-pointer group transition-all duration-300 ${
        isCollapsed
          ? 'opacity-0 pointer-events-none h-0 overflow-hidden'
          : 'opacity-100'
      }`}
    >
      <div className='flex justify-between text-[11px] font-medium text-zinc-500 mb-1 tracking-tight'>
        <span>{label}</span>
        <span className='tabular-nums text-zinc-400'>
          {used}/{total}
        </span>
      </div>

      <div className='relative h-2 rounded-full bg-zinc-800/60 shadow-inner overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:shadow-zinc-900/20'>
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
