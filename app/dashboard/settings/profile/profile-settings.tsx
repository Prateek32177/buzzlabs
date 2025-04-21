'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Save,
  RefreshCw,
  Shield,
  CheckCircle,
  VerifiedIcon,
} from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';
import { getUser } from '@/hooks/user-auth';
import { toast } from 'sonner';
import { updateUser } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
const ProfileTab = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    avatar_seed: '',
    isEmailVerified: true,
  });
  const [avatar, setAvatar] = useState(
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${userData.avatar_seed}&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede`,
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { userEmail, username, avatar_seed } = await getUser();

      setUserData({
        username: username || '',
        email: userEmail || '',
        avatar_seed: avatar_seed || '',
        isEmailVerified: true,
      });
      setAvatar(
        `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatar_seed}&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede`,
      );
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleGenerateAvatar = () => {
    // Generate a random seed for the avatar
    const seed = Math.random().toString(36).substring(7);
    setAvatar(
      `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=ffd5dc,ffdfbf,transparent,d1d4f9,c0aede`,
    );
    setUserData({ ...userData, avatar_seed: seed });
  };

  const handleSave = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('avatar_seed', userData.avatar_seed);
    try {
      const result = await updateUser(formData);

      if (result.error) {
        toast.error('Update Failed', {
          description:
            result.message ||
            'Something went wrong while updating your profile.',
        });
      } else {
        toast.success('Profile Updated', {
          description:
            result.message || 'Your profile has been updated successfully.',
        });
      }
    } catch (error) {
      toast.error('Update Failed', {
        description:
          'An unexpected error occurred while updating your profile.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <Loader />
      </div>
    );
  }
  return (
    <div className='space-y-6 animate-fade-in '>
      <Card className='p-6  glass-card rounded-lg  h-full mt-6'>
        <div className='space-y-8'>
          {/* Avatar Section */}
          <div className='flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
            <div className='relative'>
              <img
                src={avatar}
                alt='Profile Avatar'
                className='w-32 h-32 rounded-lg bg-gray-800 border border-hookflo-dark-border'
              />
              <button
                onClick={handleGenerateAvatar}
                className='absolute bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 py-2 rounded-b-lg'
              >
                <span className='text-xs text-white'>Change Avatar</span>
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-white'>
              Personal Information
            </h3>

            <div className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={userData.username || ''}
                  onChange={e =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Input
                    id='email'
                    type='email'
                    value={userData.email || ''}
                    disabled={true}
                    onChange={e =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                  {userData.isEmailVerified && (
                    <Badge className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-xs text-green-500 bg-green-900/30  rounded-full px-2 py-1'>
                      <VerifiedIcon className='h-4 w-4 mr-1' />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-start gap-4'>
            <Button
              variant={'default'}
              onClick={handleSave}
              disabled={isLoading}
              size={'sm'}
            >
              {isLoading ? (
                <>
                  <RefreshCw className='h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              variant='link'
              className='h-auto p-0 text-hookflo-accent'
              asChild
              size={'sm'}
            >
              <Link href='/protected/reset-password'>Reset password</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileTab;
