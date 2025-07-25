'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bot,
  Settings2,
  LayoutPanelTop,
  Mails,
  SlackIcon,
  Sparkles,
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getUser } from '@/hooks/user-auth';
import { HookfloIcon } from '../Logos/Hookflo';
import { useRouter, usePathname } from 'next/navigation';
import { useUsageData } from '@/hooks/use-usage-data';
import { CreateWebhookDialog } from './WebhookManagement/CreateWebhookDialog';

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
      title: 'HookSense AI',
      url: '/dashboard/hooksense',
      icon: Sparkles,
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
  const [subscriptionTier, setSubscriptionTier] = useState('');
  const { usageData } = useUsageData();
  const pathname = usePathname();
  const { state, open } = useSidebar();
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setSubscriptionTier(subscription_tier || 'Free');
    };
    fetchUser();
  }, []);
  const router = useRouter();

  return (
    <Sidebar
      collapsible='icon'
      variant='inset'
      className='bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800'
      {...props}
    >
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

      <SidebarContent className='overflow-y-auto no-scrollbar px-1'>
        <NavMain items={navItemsWithActive} />
        {!open ? null : (
          <div className='px-3 mt-6'>
            <OnboardingCard
              webhookCount={usageData?.currentUsage.webhooks.current || 0}
              onCreateClick={() => setDialogOpen(true)}
            />
          </div>
        )}
        <CreateWebhookDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onWebhookCreated={() => {
            router.push('/dashboard/webhooks');
            window.location.reload();
          }}
          initialName='First Webhook'
        />
      </SidebarContent>

      <SidebarFooter className='p-3 items-center'>
        <>
          <UsageBar
            label='Daily Email limit'
            used={usageData?.currentUsage.dailyEmails.current || 0}
            total={usageData?.subscription.limits.dailyEmails || 0}
            isCollapsed={!open}
          />
          <UsageBar
            label='Daily Slack limit'
            used={usageData?.currentUsage.dailySlackNotifications.current || 0}
            total={usageData?.subscription.limits.dailySlackNotifications || 0}
            isCollapsed={!open}
          />
        </>

        <NavUser
          user={{
            name: username,
            email,
            subscription_tier: subscriptionTier,
            avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede`,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

function UsageBar({ label, used, total, isCollapsed }: UsageBarProps) {
  const router = useRouter();
  const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <>
      {!isCollapsed && (
        <div
          onClick={() => router.push('/dashboard/settings/usage')}
          className='w-full cursor-pointer hover:bg-zinc-800/50 rounded-lg transition-colors px-3 py-2'
        >
          <div className='flex items-center gap-2'>
            <div className='h-1.5 rounded-full bg-zinc-800 relative flex-1'>
              <div
                className='absolute h-full rounded-full bg-gradient-to-r from-[#bfaaff] to-[#9d89ea] transition-all duration-300'
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className='text-xs text-zinc-400 font-medium whitespace-nowrap'>
              {used}/{total}
            </span>
          </div>
          <div className='mt-1 text-xs text-zinc-500'>{label}</div>
        </div>
      )}
    </>
  );
}

type OnboardingCardProps = {
  webhookCount: number;
  onCreateClick: () => void;
};

export function OnboardingCard({
  webhookCount,
  onCreateClick,
}: OnboardingCardProps) {
  return (
    <div className='rounded-xl bg-zinc-800/70 p-3 shadow-md border border-zinc-700 text-center'>
      {webhookCount === 0 ? (
        <>
          <h4 className='text-sm font-semibold text-white mb-1'>Get Started</h4>
          <p className='text-xs text-zinc-400 mb-3 leading-tight'>
            Create your first webhook to begin receiving alerts.
          </p>
          <button
            onClick={onCreateClick}
            className='w-full text-sm font-medium py-1.5 rounded-lg bg-gradient-to-tr from-[#A692E5] to-[#8169ff] shadow-lg hover:brightness-110 transition text-white'
          >
            Create
          </button>
        </>
      ) : (
        <>
          <h4 className='text-sm font-semibold text-white mb-1'>
            You’re All Set
          </h4>
          <p className='text-xs text-zinc-400 leading-tight'>
            Connect with your favorite applications and get notified.
          </p>
        </>
      )}
    </div>
  );
}
