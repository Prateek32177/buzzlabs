'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Webhook } from './types/webhook';
import { ArrowLeft, Mail, MessageSquare, Play, SlackIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Step4Props {
  webhooks: Webhook[];
  selectedWebhook: Webhook | null;
  selectedApp: string | null;
  selectedEvents: string[];
  goToPreviousStep: () => void;
}

export function Step4WebhookTesting({
  webhooks,
  selectedWebhook,
  selectedApp,
  selectedEvents,
  goToPreviousStep,
}: Step4Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<
    'email' | 'slack' | null
  >(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTriggerEvent = (event: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentEvent(event);

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show notification after a delay
    timeoutRef.current = setTimeout(() => {
      if (selectedWebhook?.notificationServices.email) {
        setShowNotification('email');

        // Show slack notification after email if both are enabled
        if (selectedWebhook?.notificationServices.slack) {
          timeoutRef.current = setTimeout(() => {
            setShowNotification('slack');

            // Reset everything after animations
            timeoutRef.current = setTimeout(() => {
              setShowNotification(null);
              setIsAnimating(false);
              setCurrentEvent(null);
            }, 3000);
          }, 3000);
        } else {
          // Reset if only email is enabled
          timeoutRef.current = setTimeout(() => {
            setShowNotification(null);
            setIsAnimating(false);
            setCurrentEvent(null);
          }, 3000);
        }
      } else if (selectedWebhook?.notificationServices.slack) {
        // Show only slack notification
        setShowNotification('slack');

        // Reset after animation
        timeoutRef.current = setTimeout(() => {
          setShowNotification(null);
          setIsAnimating(false);
          setCurrentEvent(null);
        }, 3000);
      } else {
        // No notifications enabled
        setIsAnimating(false);
        setCurrentEvent(null);
      }
    }, 2000);
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
          Step 4: Test Your Webhook
        </h3>
        <p className='text-violet-200 mb-6'>
          Trigger events and see your webhook in action with real-time
          notifications.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Event Triggers */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-6'>
          <h4 className='text-lg font-medium text-white mb-4'>
            Trigger Events
          </h4>

          {selectedApp && (
            <div className='space-y-3'>
              <div className='bg-gray-900/50 p-3 rounded-md'>
                <span className='text-violet-300 text-sm'>
                  Selected Application
                </span>
                <div className='text-white mt-1 font-medium capitalize'>
                  {selectedApp}
                </div>
              </div>

              <div className='bg-gray-900/50 p-3 rounded-md'>
                <span className='text-violet-300 text-sm'>
                  Selected Webhook
                </span>
                <div className='text-white mt-1 font-medium'>
                  {selectedWebhook?.name}
                </div>
              </div>

              <div className='space-y-3 mt-6'>
                <h5 className='text-white font-medium'>Available Events</h5>
                <div className='grid grid-cols-1 gap-3'>
                  {selectedEvents.map(event => (
                    <Button
                      key={event}
                      onClick={() => handleTriggerEvent(event)}
                      disabled={isAnimating}
                      className={`justify-between ${
                        currentEvent === event
                          ? 'bg-violet-700 hover:bg-violet-800 text-white'
                          : 'bg-gray-900/70 hover:bg-violet-900/50 text-white'
                      }`}
                    >
                      <span className='capitalize'>
                        {event.replace(/_/g, ' ')}
                      </span>
                      <Play className='h-4 w-4 ml-2' />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animation Preview */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg border border-violet-800/30 p-6 relative overflow-hidden'>
          <h4 className='text-lg font-medium text-white mb-4'>Live Preview</h4>

          <div className='aspect-video bg-gray-900/70 rounded-lg overflow-hidden relative'>
            {/* Application animation area */}
            <div className='absolute inset-0 flex items-center justify-center'>
              {!currentEvent ? (
                <div className='text-gray-500 text-center'>
                  <p>Trigger an event to see it in action</p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='w-full h-full flex items-center justify-center'
                >
                  {selectedApp === 'supabase' && (
                    <div className='relative w-4/5 max-w-md'>
                      <div className='bg-gray-800 rounded-t-lg p-3 border-b border-gray-700'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center mr-3'>
                            <svg
                              viewBox='0 0 24 24'
                              className='w-5 h-5 text-emerald-500'
                              fill='currentColor'
                            >
                              <path d='M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z' />
                            </svg>
                          </div>
                          <span className='text-white font-medium'>
                            Supabase Database
                          </span>
                        </div>
                      </div>
                      <div className='bg-gray-900 p-4 rounded-b-lg border border-gray-700 border-t-0'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Event:</span>
                            <span className='text-violet-400 font-medium capitalize'>
                              {currentEvent}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Table:</span>
                            <span className='text-white'>users</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Status:</span>
                            <span className='text-emerald-400'>Success</span>
                          </div>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5 }}
                            className='h-1 bg-violet-600 rounded-full mt-2'
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApp === 'github' && (
                    <div className='relative w-4/5 max-w-md'>
                      <div className='bg-gray-800 rounded-t-lg p-3 border-b border-gray-700'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3'>
                            <svg
                              viewBox='0 0 24 24'
                              className='w-5 h-5 text-white'
                              fill='currentColor'
                            >
                              <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                            </svg>
                          </div>
                          <span className='text-white font-medium'>
                            GitHub Repository
                          </span>
                        </div>
                      </div>
                      <div className='bg-gray-900 p-4 rounded-b-lg border border-gray-700 border-t-0'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Event:</span>
                            <span className='text-violet-400 font-medium capitalize'>
                              {currentEvent?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Repository:</span>
                            <span className='text-white'>user/project</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Status:</span>
                            <span className='text-emerald-400'>Triggered</span>
                          </div>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5 }}
                            className='h-1 bg-violet-600 rounded-full mt-2'
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApp === 'stripe' && (
                    <div className='relative w-4/5 max-w-md'>
                      <div className='bg-gray-800 rounded-t-lg p-3 border-b border-gray-700'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center mr-3'>
                            <svg
                              viewBox='0 0 24 24'
                              className='w-5 h-5 text-blue-500'
                              fill='currentColor'
                            >
                              <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z' />
                            </svg>
                          </div>
                          <span className='text-white font-medium'>
                            Stripe Payment
                          </span>
                        </div>
                      </div>
                      <div className='bg-gray-900 p-4 rounded-b-lg border border-gray-700 border-t-0'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Event:</span>
                            <span className='text-violet-400 font-medium capitalize'>
                              {currentEvent?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Customer:</span>
                            <span className='text-white'>cus_1234567890</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-gray-400'>Status:</span>
                            <span className='text-emerald-400'>Processed</span>
                          </div>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5 }}
                            className='h-1 bg-violet-600 rounded-full mt-2'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNotification === 'email' &&
        toast.custom(
          () => (
            <div className='bg-white rounded-lg shadow-xl overflow-hidden z-50 w-80'>
              <div className='bg-white w-full h-full p-0 m-0'>
                <div className='bg-red-600 px-4 py-2 flex items-center'>
                  <Mail className='text-white h-5 w-5 mr-2' />
                  <span className='text-white font-medium'>Gmail</span>
                </div>
                <div className='p-4'>
                  <h5 className='font-medium text-gray-900'>
                    New Email Notification
                  </h5>
                  <p className='text-gray-700 text-sm mt-1'>
                    {selectedApp} {currentEvent?.replace(/_/g, ' ')} event
                    triggered
                  </p>
                  <p className='text-gray-500 text-xs mt-2'>Just now</p>
                </div>
              </div>
            </div>
          ),
          { id: 'email-notification' },
        )}

      {showNotification === 'slack' &&
        toast.custom(
          () => {
            return (
              <div className='bg-white rounded-lg shadow-xl overflow-hidden z-50 w-80'>
                <div className='bg-purple-600 px-4 py-2 flex items-center'>
                  <SlackIcon className='text-white h-5 w-5 mr-2' />
                  <span className='text-white font-medium'>Slack</span>
                </div>
                <div className='p-4'>
                  <h5 className='font-medium text-gray-900'>
                    New Slack Message
                  </h5>
                  <p className='text-gray-700 text-sm mt-1'>
                    New {selectedApp} event: {currentEvent?.replace(/_/g, ' ')}
                  </p>
                  <p className='text-gray-500 text-xs mt-2'>Just now</p>
                </div>
              </div>
            );
          },
          { id: 'slack-notification' },
        )}

      <div className='flex justify-between mt-6'>
        <Button
          onClick={goToPreviousStep}
          variant='outline'
          className='border-violet-600 text-violet-200 hover:bg-violet-900/30'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Previous
        </Button>
        <Button
          className='bg-violet-600 hover:bg-violet-700 text-white'
          onClick={() => window.location.reload()}
        >
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}
