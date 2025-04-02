"use client"


import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Shield } from 'lucide-react';

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Kolkata', label: 'India Time (IST)' },
  { value: 'Europe/London', label: 'GMT (Greenwich Mean Time)' },
  { value: 'Europe/Paris', label: 'CET (Central European Time)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
];

const ProfileTab = () => {
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/pixel-art/svg?seed=John');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  const handleGenerateAvatar = () => {
    // Generate a random seed for the avatar
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`);
  };
  
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 glass">
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div>
              <img 
                src={avatar} 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-lg bg-gray-800 border border-hookflo-dark-border"
              />
            </div>
            <div>
              <Button 
                variant="outline" 
                className="bg-hookflo-dark-card text-white hover:bg-gray-800"
                onClick={handleGenerateAvatar}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Random Avatar
              </Button>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-gray-800 border-hookflo-dark-border text-white"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="bg-gray-800 border-hookflo-dark-border text-white"
                  />
                  {isEmailVerified && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-xs text-hookflo-green">
                      Verified
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-hookflo-accent"
                >
                  Reset password
                </Button>
              </div>
            </div>
          </div>
          
          {/* Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Security</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-hookflo-accent" />
                  <span className="text-sm font-medium">Two-Factor Authentication</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled} 
                className="data-[state=checked]:bg-hookflo-accent"
              />
            </div>
          </div>
          
          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Preferences</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="bg-gray-800 border-hookflo-dark-border text-white">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-hookflo-dark-border text-white">
                  {TIMEZONES.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-start">
            <Button 
            variant={"default"}
              onClick={handleSave} 
              disabled={isLoading}
              // className="bg-hookflo-blue hover:bg-hookflo-blue/90 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileTab;
