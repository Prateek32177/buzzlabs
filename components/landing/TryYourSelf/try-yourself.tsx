'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1WebhookCreation } from './step1-webhook-creation';
import { Step2WebhookManagement } from './step2-webhook-management';
import { Step3ApplicationIntegration } from './step3-application-integration';
import { Step4WebhookTesting } from './step4-webhook-testing';
import type { Webhook } from './types/webhook';

export default function TryYourself() {
  const [currentStep, setCurrentStep] = useState(1);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className='w-full py-20 relative overflow-hidden'>
      {/* Glass morphism background */}
      <div className='absolute inset-0 bg-gradient-to-br from-violet-950/30 to-black/50 backdrop-blur-md z-0' />

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl font-bold text-white mb-4'>Try Yourself</h2>
          <p className='text-violet-200 max-w-2xl mx-auto'>
            Experience the power of our webhook management system with this
            interactive demo. Follow the steps below to create, manage, and test
            webhooks in real-time.
          </p>
        </motion.div>

        {/* Step progress indicator */}
        <div className='flex justify-center mb-12'>
          <div className='flex items-center max-w-3xl w-full'>
            {[1, 2, 3, 4].map(step => (
              <div key={step} className='flex-1 flex items-center'>
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step === currentStep
                      ? 'bg-violet-600 text-white'
                      : step < currentStep
                        ? 'bg-violet-800 text-white'
                        : 'bg-gray-800 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {step}
                </motion.div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 ${step < currentStep ? 'bg-violet-600' : 'bg-gray-700'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content container */}
        <div className='bg-gray-900/60 backdrop-blur-lg rounded-xl border border-violet-900/50 shadow-xl p-6 md:p-8 max-w-5xl mx-auto'>
          <AnimatePresence mode='wait'>
            {currentStep === 1 && (
              <Step1WebhookCreation
                key='step1'
                webhooks={webhooks}
                setWebhooks={setWebhooks}
                goToNextStep={goToNextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2WebhookManagement
                key='step2'
                webhooks={webhooks}
                setWebhooks={setWebhooks}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
                setSelectedWebhook={setSelectedWebhook}
              />
            )}
            {currentStep === 3 && (
              <Step3ApplicationIntegration
                key='step3'
                webhooks={webhooks}
                selectedWebhook={selectedWebhook}
                setSelectedWebhook={setSelectedWebhook}
                selectedApp={selectedApp}
                setSelectedApp={setSelectedApp}
                selectedEvents={selectedEvents}
                setSelectedEvents={setSelectedEvents}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
              />
            )}
            {currentStep === 4 && (
              <Step4WebhookTesting
                key='step4'
                webhooks={webhooks}
                selectedWebhook={selectedWebhook}
                selectedApp={selectedApp}
                selectedEvents={selectedEvents}
                goToPreviousStep={goToPreviousStep}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
