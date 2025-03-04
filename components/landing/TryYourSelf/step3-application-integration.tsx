'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Webhook } from './types/webhook';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Step3Props {
  webhooks: Webhook[];
  selectedWebhook: Webhook | null;
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>;
  selectedApp: string | null;
  setSelectedApp: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEvents: string[];
  setSelectedEvents: React.Dispatch<React.SetStateAction<string[]>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// Application event options
const applicationEvents = {
  supabase: ['insert', 'update', 'delete', 'authentication', 'storage'],
  github: ['push', 'pull_request', 'fork', 'star', 'issue', 'release'],
  stripe: [
    'payment_succeeded',
    'payment_failed',
    'subscription_created',
    'subscription_updated',
    'refund_processed',
  ],
};

export function Step3ApplicationIntegration({
  webhooks,
  selectedWebhook,
  setSelectedWebhook,
  selectedApp,
  setSelectedApp,
  selectedEvents,
  setSelectedEvents,
  goToNextStep,
  goToPreviousStep,
}: Step3Props) {
  const [error, setError] = useState<string | null>(null);

  // Reset selected events when application changes
  useEffect(() => {
    setSelectedEvents([]);
  }, [selectedApp, setSelectedEvents]);

  const handleSelectWebhook = (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (webhook) {
      setSelectedWebhook(webhook);
    }
  };

  const handleSelectApp = (app: string) => {
    setSelectedApp(app);
  };

  const handleToggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleNext = () => {
    if (!selectedWebhook) {
      setError('Please select a webhook');
      return;
    }

    if (!selectedApp) {
      setError('Please select an application');
      return;
    }

    if (selectedEvents.length === 0) {
      setError('Please select at least one event');
      return;
    }

    setError(null);
    goToNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-white mb-2'>
          Step 3: Integrate with Applications
        </h3>
        <p className='text-violet-200 mb-6'>
          Connect your webhook to applications and select the events you want to
          trigger.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Application Selection */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-6'>
          <h4 className='text-lg font-medium text-white mb-4'>
            1. Select an Application
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {['supabase', 'github', 'stripe'].map(app => (
              <motion.div
                key={app}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectApp(app)}
                className={`cursor-pointer p-4 rounded-lg border ${
                  selectedApp === app
                    ? 'bg-violet-900/40 border-violet-500'
                    : 'bg-gray-900/40 border-gray-700 hover:border-violet-700/50'
                } flex items-center justify-between`}
              >
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3'>
                    {app === 'supabase' && (
                      <svg
                        viewBox='0 0 24 24'
                        className='w-6 h-6 text-emerald-500'
                        fill='currentColor'
                      >
                        <path d='M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z' />
                      </svg>
                    )}
                    {app === 'github' && (
                      <svg
                        viewBox='0 0 24 24'
                        className='w-6 h-6 text-white'
                        fill='currentColor'
                      >
                        <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                      </svg>
                    )}
                    {app === 'stripe' && (
                      <svg
                        viewBox='0 0 24 24'
                        className='w-6 h-6 text-blue-500'
                        fill='currentColor'
                      >
                        <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z' />
                      </svg>
                    )}
                  </div>
                  <span className='text-white capitalize'>{app}</span>
                </div>
                {selectedApp === app && (
                  <Check className='h-5 w-5 text-violet-400' />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Webhook Selection */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-6'>
          <h4 className='text-lg font-medium text-white mb-4'>
            2. Select a Webhook
          </h4>
          <Select
            value={selectedWebhook?.id}
            onValueChange={handleSelectWebhook}
            disabled={!selectedApp}
          >
            <SelectTrigger className='bg-gray-900/70 border-violet-700/50 text-white'>
              <SelectValue placeholder='Select a webhook' />
            </SelectTrigger>
            <SelectContent className='bg-gray-900 border-violet-700/50 text-white'>
              {webhooks.map(webhook => (
                <SelectItem key={webhook.id} value={webhook.id}>
                  {webhook.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedWebhook && (
            <div className='mt-4 space-y-3'>
              <div className='bg-gray-900/50 p-3 rounded-md'>
                <Label className='text-violet-300 text-sm'>Webhook URL</Label>
                <div className='text-white mt-1 font-mono text-sm truncate'>
                  {selectedWebhook.url}
                </div>
              </div>
              <div className='bg-gray-900/50 p-3 rounded-md'>
                <Label className='text-violet-300 text-sm'>Secret Key</Label>
                <div className='text-white mt-1 font-mono text-sm'>
                  ••••••••••••••••••••••
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Selection */}
        {selectedApp && (
          <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-6'>
            <h4 className='text-lg font-medium text-white mb-4'>
              3. Select Events
            </h4>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
              {applicationEvents[
                selectedApp as keyof typeof applicationEvents
              ].map(event => (
                <div key={event} className='flex items-center space-x-2'>
                  <Checkbox
                    id={event}
                    checked={selectedEvents.includes(event)}
                    onCheckedChange={() => handleToggleEvent(event)}
                    className='data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600'
                  />
                  <label
                    htmlFor={event}
                    className='text-white cursor-pointer capitalize'
                  >
                    {event.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className='bg-red-900/30 border border-red-800 text-white p-3 rounded-md'>
            {error}
          </div>
        )}
      </div>

      <div className='flex justify-between mt-6'>
        <Button
          onClick={goToPreviousStep}
          variant='outline'
          className='border-violet-600 text-violet-200 hover:bg-violet-900/30'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Previous
        </Button>
        <Button
          onClick={handleNext}
          className='bg-violet-600 hover:bg-violet-700 text-white'
          disabled={
            !selectedApp || !selectedWebhook || selectedEvents.length === 0
          }
        >
          Create Integration <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </motion.div>
  );
}
