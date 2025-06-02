'use client';

import { motion } from 'framer-motion';
import { UseCaseCard } from '../UseCaseCard';
import { useCases } from '../UseCaseCard';

export function UseCaseSection() {
  return (
    <section className=' relative  text-white py-24 px-4 md:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12 md:mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border-[0.5px] border-white/10 mb-6'>
            <div className='w-1.5 h-1.5 rounded-full bg-purple-400/70' />
            <span className='text-xs text-zinc-300 font-medium'>Use Cases</span>
          </div>

          <h2 className='text-3xl md:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent'>
            Built for Every Workflow
          </h2>

          <p className='text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed'>
            Discover how teams streamline operations with real-time
            notifications and integrations.
          </p>
        </div>
        {/* Bento Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[200px] px-6'>
          {useCases.map((item, idx) => {
            const Icon = item.icon;
            const span =
              idx === 0 ? 'md:row-span-2' : idx === 3 ? 'md:col-span-2' : '';
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`relative border border-zinc-800 bg-zinc-900/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 ${span}`}
              >
                <UseCaseCard key={idx} useCase={item} index={idx} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
