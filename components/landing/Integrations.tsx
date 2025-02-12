import { motion } from 'framer-motion';
import {
  Slack,
  MessageSquare,
  Mail,
  Bell,
  Database,
  CreditCard,
} from 'lucide-react';

const integrations = [
  {
    name: 'Slack',
    icon: Slack,
    description: 'Send notifications to Slack channels',
  },
  {
    name: 'Discord',
    icon: MessageSquare,
    description: 'Integrate with Discord servers',
  },
  { name: 'Email', icon: Mail, description: 'Deliver notifications via email' },
  {
    name: 'Push Notifications',
    icon: Bell,
    description: 'Send push notifications to mobile devices',
  },
  {
    name: 'Database Changes',
    icon: Database,
    description: 'Capture database change events',
  },
  {
    name: 'Payment Events',
    icon: CreditCard,
    description: 'Monitor and react to payment events',
  },
];

export default function Integrations() {
  return (
    <section id='integrations' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-16'
        >
          <h2 className='text-3xl font-bold sm:text-4xl mb-4'>
            Powerful Integrations
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Connect WebhookPro with your favorite tools and services
          </p>
        </motion.div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 glow'>
                <integration.icon className='w-12 h-12 text-primary mb-4' />
                <h3 className='text-xl font-semibold mb-2'>
                  {integration.name}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {integration.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
