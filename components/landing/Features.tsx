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
              className='relative overflow-hidden rounded-lg group'
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div
                className={`rounded-lg relative bg-zinc-800/50 backdrop-blur-sm p-6 h-full border border-zinc-700/50 group-hover:border-emerald-500/50 transition-colors duration-300`}
              >
                <div className='flex items-center justify-between mb-4'>
                  <span>
                    <feature.icon className='w-10 h-10 text-emerald-500 mb-4' />
                  </span>
                </div>

                <h4
                  className={`text-xl font-bold mb-2 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 max-w-sm`}
                >
                  {feature.title}
                </h4>

                <p className='text-zinc-300 text-sm mb-4 max-w-md'>
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
