'use client';
import { Sparkles } from 'lucide-react';

export default function HookSensePage() {
  return (
    <div className=' flex items-center justify-center my-[30vh]'>
      <div className='text-center space-y-3 px-6 py-5 rounded-xl bg-white/5 backdrop-blur-md shadow-lg border border-white/10'>
        <h2 className='text-sm  text-zinc-400 '>The Ultimate Event Log AI</h2>
        <div className='flex items-center justify-center gap-2'>
          <h1 className='text-2xl font-semibold bg-gradient-to-r from-pink-300 to-indigo-400 bg-clip-text text-transparent'>
            HookSense
          </h1>
          <Sparkles className='w-5 h-5 text-indigo-400 fill-indigo-300' />
        </div>
        <p className='text-sm text-zinc-400'>Coming Soon....</p>
      </div>
    </div>
  );
}
