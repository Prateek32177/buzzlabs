'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Download, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Sample billing history data
const billingHistory = [
  {
    id: 1,
    date: 'Aug 1, 2023',
    amount: '$0.00',
    status: 'Free Plan',
    invoice: '#INV-001',
  },
  {
    id: 2,
    date: 'Jul 1, 2023',
    amount: '$0.00',
    status: 'Free Plan',
    invoice: '#INV-002',
  },
  {
    id: 3,
    date: 'Jun 1, 2023',
    amount: '$0.00',
    status: 'Free Plan',
    invoice: '#INV-003',
  },
];

// Plan data
const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['5 webhooks', '10K tokens daily', 'Email notifications'],
    current: true,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$15',
    period: '/month',
    features: [
      '20 webhooks',
      '50K tokens daily',
      'All notification channels',
      'API access',
    ],
    current: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/month',
    features: [
      'Unlimited webhooks',
      '200K tokens daily',
      'Premium support',
      'Advanced analytics',
    ],
    current: false,
  },
];

const PlansTab = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const { toast } = useToast();

  const handleUpgrade = (planId: string) => {
    if (planId !== currentPlan) {
      toast({
        title: 'Upgrade initiated',
        description: `You're being redirected to upgrade to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      });
    }
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Current Plan */}
      <Card className='p-6 glass'>
        <h3 className='text-lg font-medium text-white mb-4'>Current Plan</h3>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div>
            <h4 className='text-xl font-bold text-white'>Free Plan</h4>
            <p className='text-sm text-gray-400'>
              Basic plan for getting started with Hookflo
            </p>
          </div>
          <div className='text-sm flex items-center text-hookflo-green'>
            <Clock className='h-4 w-4 mr-1' />
            Your limit will reset at midnight IST
          </div>
        </div>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className='text-lg font-medium text-white mb-4'>Available Plans</h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={cn(
                'p-6 glass relative overflow-hidden flex flex-col justify-between',
                plan.current && 'border-hookflo-blue',
              )}
            >
              {plan.current && (
                <div className='absolute top-2 right-2 bg-hookflo-blue text-xs py-1 px-2 rounded-full text-white'>
                  Current
                </div>
              )}

              <h4 className='text-lg font-medium text-white mb-2'>
                {plan.name}
              </h4>
              <div className='mb-4'>
                <span className='text-2xl font-bold text-white'>
                  {plan.price}
                </span>
                <span className='text-gray-400'>{plan.period}</span>
              </div>

              <ul className='space-y-2 mb-6'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-start text-sm'>
                    <Check className='h-4 w-4 mr-2 text-hookflo-green shrink-0 mt-0.5' />
                    <span className='text-gray-300'>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className='mt-auto'>
                <Button
                  variant={'default'}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.current}
                  // className={cn(
                  //   "w-full",
                  //   plan.current
                  //     ? "bg-gray-700 text-gray-400 hover:bg-gray-700 cursor-not-allowed"
                  //     : "bg-hookflo-blue hover:bg-hookflo-blue/90 text-white"
                  // )}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card className='p-6 glass'>
        <h3 className='text-lg font-medium text-white mb-4'>Payment Method</h3>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center'>
            <CreditCard className='h-6 w-6 mr-3 text-gray-400' />
            <div>
              <p className='text-white'>No payment method on file</p>
              <p className='text-sm text-gray-400'>
                Add a payment method to upgrade your plan
              </p>
            </div>
          </div>

          <Button
            variant='default'
            // className='bg-hookflo-dark-card border-gray-700 text-white hover:bg-gray-800'
          >
            Add Payment Method
          </Button>
        </div>
      </Card>

      {/* Billing History */}
      <Card className='p-6 glass'>
        <h3 className='text-lg font-medium text-white mb-4'>Billing History</h3>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b border-hookflo-dark-border'>
              <tr>
                <th className='text-left py-3 text-sm font-medium text-gray-400'>
                  Date
                </th>
                <th className='text-left py-3 text-sm font-medium text-gray-400'>
                  Amount
                </th>
                <th className='text-left py-3 text-sm font-medium text-gray-400'>
                  Status
                </th>
                <th className='text-left py-3 text-sm font-medium text-gray-400'>
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map(item => (
                <tr
                  key={item.id}
                  className='border-b border-hookflo-dark-border'
                >
                  <td className='py-3 text-sm text-white'>{item.date}</td>
                  <td className='py-3 text-sm text-white'>{item.amount}</td>
                  <td className='py-3 text-sm text-white'>{item.status}</td>
                  <td className='py-3 text-sm text-white'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 p-0 text-hookflo-accent hover:text-hookflo-blue hover:bg-transparent'
                    >
                      <Download className='h-4 w-4 mr-1' />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PlansTab;
