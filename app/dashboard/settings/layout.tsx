'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, usePathname } from 'next/navigation';
import { User, BarChart, CreditCard } from 'lucide-react';

const tabs = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <User className='h-4 w-4 mr-2' />,
  },
  {
    value: 'usage',
    label: 'Usage',
    icon: <BarChart className='h-4 w-4 mr-2' />,
  },
  {
    value: 'plans',
    label: 'Plans & Billing',
    icon: <CreditCard className='h-4 w-4 mr-2' />,
  },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab =
    pathname === '/dashboard/settings'
      ? 'profile'
      : pathname.split('/').pop() || 'profile';

  const handleTabChange = (value: string) => {
    const path =
      value === 'profile'
        ? '/dashboard/settings'
        : `/dashboard/settings/${value}`;
    router.push(path);
  };

  const triggerClass =
    'relative px-4 py-2 rounded-md transition-all duration-300 text-white hover:border hover:border-white/30 data-[state=active]:text-violet data-[state=active]:border data-[state=active]:border-white';

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl text-white font-bold mb-6'>Settings</h1>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        <TabsList className='bg-hookflo-dark-card mb-6 flex gap-2 justify-start'>
          {tabs.map(({ value, label, icon }) => (
            <TabsTrigger key={value} value={value} className={triggerClass}>
              {icon} {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value={currentTab}
          className='mt-0 focus-visible:outline-none focus-visible:ring-0'
        >
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsLayout;
