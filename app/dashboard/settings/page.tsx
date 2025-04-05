'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from './profile-settings';
import UsageTab from './usage-settings';
import PlansTab from './plans-settings';
import { LucideIcon, Settings, User, BarChart, CreditCard } from 'lucide-react';

const SettingsLayout = () => {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex flex-col'>
        <h1 className='text-3xl text-white font-bold mb-6'>Settings</h1>

        <Tabs defaultValue='profile' className='w-full  animate-fade-in'>
          <TabsList className='bg-hookflo-dark-card mb-6 flex gap-2 justify-start'>
            <TabsTrigger
              value='profile'
              className='relative px-4 py-2 rounded-md transition-all duration-300 
               text-white data-[state=active]:text-violet
               data-[state=active]:border data-[state=active]:border-white
                hover:border hover:border-white/30'
            >
              <User className='h-4 w-4 mr-2' />
              Profile
            </TabsTrigger>

            <TabsTrigger
              value='usage'
              className='relative px-4 py-2 rounded-md transition-all duration-300 
               text-white data-[state=active]:text-violet
               data-[state=active]:border data-[state=active]:border-white
               hover:border hover:border-white/30'
            >
              <BarChart className='h-4 w-4 mr-2' />
              Usage
            </TabsTrigger>

            <TabsTrigger
              value='plans'
              className='relative px-4 py-2 rounded-md transition-all duration-300 
               text-white data-[state=active]:text-violet
               data-[state=active]:border data-[state=active]:border-white
               hover:border hover:border-white/30
               '
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
