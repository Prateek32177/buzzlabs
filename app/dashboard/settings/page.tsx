'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from './profile-settings';
import UsageTab from './usage-settings';
import PlansTab from './plans-settings';
import { LucideIcon, Settings, User, BarChart, CreditCard } from 'lucide-react';

const SettingsLayout = () => {
  return (
    <div className='min-h-screen bg-hookflo-dark p-6'>
      <div className='max-w-6xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
            <Settings className='h-6 w-6' />
            Settings
          </h1>
        </header>

        <Tabs defaultValue='profile' className='w-full animate-fade-in'>
          <TabsList className='bg-hookflo-dark-card mb-6 flex gap-2'>
            <TabsTrigger
              value='profile'
              className='relative px-4 py-2 rounded-md transition-all duration-300 
               text-white data-[state=active]:text-violet
               data-[state=active]:shadow-[0_0_15px_rgba(168,85,247,0.5)] 
               data-[state=active]:border-2 data-[state=active]:border-violet-500
               hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]'
            >
              <User className='h-4 w-4 mr-2' />
              Profile
            </TabsTrigger>

            <TabsTrigger
              value='usage'
              className='relative px-4 py-2 rounded-md transition-all duration-300 
               text-white data-[state=active]:text-violet
               data-[state=active]:shadow-[0_0_15px_rgba(168,85,247,0.5)] 
               data-[state=active]:border-2 data-[state=active]:border-violet-500
               hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]'
            >
              <BarChart className='h-4 w-4 mr-2' />
              Usage
            </TabsTrigger>

            <TabsTrigger
              value='plans'
              className='relative px-4 py-2 rounded-md transition-all duration-300 
               text-white data-[state=active]:text-violet
               data-[state=active]:shadow-[0_0_15px_rgba(168,85,247,0.5)] 
               data-[state=active]:border-2 data-[state=active]:border-violet-500
               hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]'
            >
              <CreditCard className='h-4 w-4 mr-2' />
              Plans & Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='profile'
            className='mt-0 focus-visible:outline-none focus-visible:ring-0'
          >
            <ProfileTab />
          </TabsContent>

          <TabsContent
            value='usage'
            className='mt-0 focus-visible:outline-none focus-visible:ring-0'
          >
            <UsageTab />
          </TabsContent>

          <TabsContent
            value='plans'
            className='mt-0 focus-visible:outline-none focus-visible:ring-0'
          >
            <PlansTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsLayout;
