"use client"

// import { useState, useEffect } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import ProfileSettings from "./profile-settings"
// import UsageSettings from "./usage-settings"
// import PlansSettings from "./plans-settings"
// import { Loader2 } from "lucide-react"

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState("profile")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isTabChanging, setIsTabChanging] = useState(false)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false)
//     }, 800)

//     return () => clearTimeout(timer)
//   }, [])

//   const handleTabChange = (value: string) => {
//     setIsTabChanging(true)
//     setTimeout(() => {
//       setActiveTab(value)
//       setIsTabChanging(false)
//     }, 300)
//   }

//   if (isLoading) {
//     return (
//       <div className="container bg-zinc-900 mx-auto py-8 px-4 max-w-6xl min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-12 w-12 text-violet-500 animate-spin mb-4" />
//           <p className="text-zinc-400">Loading settings...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className=" bg-zinc-900 mx-auto py-8 px-4  min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-white">Settings</h1>

//       <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange} className="w-full">
//   <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md space-x-6">
//     <TabsTrigger 
//       value="profile" 
//     >
//       Profile
//     </TabsTrigger>
//     <TabsTrigger 
//       value="usage" 
//     >
//       Usage
//     </TabsTrigger>
//     <TabsTrigger 
//       value="plans" 
//     >
//       Plans & Billing
//     </TabsTrigger>
//   </TabsList>

//   <div className={`transition-opacity duration-300 ${isTabChanging ? "opacity-0" : "opacity-100"}`}>
//     <TabsContent value="profile" className="mt-0">
//       <ProfileSettings />
//     </TabsContent>

//     <TabsContent value="usage" className="mt-0">
//       <UsageSettings />
//     </TabsContent>

//     <TabsContent value="plans" className="mt-0">
//       <PlansSettings />
//     </TabsContent>
//   </div>
// </Tabs>

//     </div>
//   )
// }

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from  './profile-settings';
import UsageTab from './usage-settings';
import PlansTab from './plans-settings';
import { LucideIcon, Settings, User, BarChart, CreditCard } from 'lucide-react';

const SettingsLayout = () => {
  return (
    <div className="min-h-screen bg-hookflo-dark p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
        </header>
        
        <Tabs defaultValue="profile" className="w-full animate-fade-in">
          {/* <TabsList className="bg-hookflo-dark-card border border-hookflo-dark-border mb-6"> */}
          <TabsList className="bg-hookflo-dark-card  mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-hookflo-blue/20 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-hookflo-blue/20 data-[state=active]:text-white">
              <BarChart className="h-4 w-4 mr-2" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-hookflo-blue/20 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Plans & Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ProfileTab />
          </TabsContent>
          
          <TabsContent value="usage" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <UsageTab />
          </TabsContent>
          
          <TabsContent value="plans" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <PlansTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsLayout;
