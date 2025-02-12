import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, Cpu, Globe, Repeat } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Notifications',
    description: 'Send real-time alerts across multiple channels',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security for your webhook infrastructure',
  },
  {
    icon: Sparkles,
    title: 'Easy Integration',
    description: 'Seamlessly connect with your existing tech stack',
  },
  {
    icon: Cpu,
    title: 'Powerful Processing',
    description: 'Handle millions of events with ease',
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Distributed infrastructure for low-latency worldwide',
  },
  {
    icon: Repeat,
    title: 'Flexible Routing',
    description: 'Route events to different endpoints based on rules',
  },
];

export default function Features() {
  return (
    <section id='features' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-16'
        >
          <h2 className='text-3xl font-bold sm:text-4xl mb-4'>
            Powerful Features
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Discover how WebhookPro can transform your event-driven architecture
          </p>
        </motion.div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 glow'>
                <feature.icon className='w-12 h-12 text-primary mb-4' />
                <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
