'use client';

import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Webhook } from './types/webhook';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Step1Props {
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  goToNextStep: () => void;
}

export function Step1WebhookCreation({
  webhooks,
  setWebhooks,
  goToNextStep,
}: Step1Props) {
  const [webhookName, setWebhookName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateWebhookUrl = () => {
    return `https://api.yourwebhookservice.com/webhook/${crypto.randomUUID()}`;
  };

  const generateSecretKey = () => {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(36)).join('');
  };

  const handleCreateWebhook = () => {
    if (!webhookName.trim()) {
      setError('Please enter a webhook name');
      return;
    }

    if (webhooks.length >= 5) {
      setError('You can create a maximum of 5 webhooks');
      return;
    }

    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      name: webhookName,
      url: generateWebhookUrl(),
      secretKey: generateSecretKey(),
      isActive: true,
      notificationServices: {
        email: true,
        slack: true,
      },
    };

    setWebhooks([...webhooks, newWebhook]);
    setWebhookName('');
    setError(null);
  };

  const handleNext = () => {
    if (webhooks.length === 0) {
      setError('Please create at least one webhook before proceeding');
      return;
    }
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
          Step 1: Create Your Webhook
        </h3>
        <p className='text-violet-200 mb-6'>
          Start by creating a webhook. You can create up to 5 webhooks.
        </p>
      </div>

      <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <Input
            placeholder='Enter webhook name'
            value={webhookName}
            onChange={e => setWebhookName(e.target.value)}
            className='bg-gray-900/70 border-violet-700/50 text-white'
          />
          <Button
            onClick={handleCreateWebhook}
            className='bg-violet-600 hover:bg-violet-700 text-white'
          >
            <Plus className='mr-2 h-4 w-4' /> Create Webhook
          </Button>
        </div>

        {error &&
          toast.error('Error', {
            description: error,
          })}

        {webhooks.length > 0 && (
          <div className='mt-6'>
            <h4 className='text-lg font-medium text-white mb-3'>
              Created Webhooks:
            </h4>
            <div className='space-y-2'>
              {webhooks.map(webhook => (
                <motion.div
                  key={webhook.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-gray-900/50 border border-violet-800/30 rounded-lg p-3 flex justify-between items-center'
                >
                  <span className='text-white'>{webhook.name}</span>
                  <span className='text-violet-300 text-sm'>Created</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex justify-end mt-6'>
        <Button
          onClick={handleNext}
          className='bg-violet-600 hover:bg-violet-700 text-white'
        >
          Next Step
        </Button>
      </div>
    </motion.div>
  );
}
