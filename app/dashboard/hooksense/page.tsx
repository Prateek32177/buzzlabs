'use client';

import WebhookAIDebugger from './WebhookAidebugger';
import { getUser } from '@/hooks/user-auth';
import { useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';

export default function HookSensePage() {
  const [userId, setUserId] = useState('');
  const [logsCount, setLogsCount] = useState(30);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserId(user.userId ?? '');
    };
    fetchUser();
  }, []);

  return (
    <div className='relative'>
      <WebhookAIDebugger userId={userId} />
      {logsCount < 30 && (
        <div className='absolute inset-0 bg-zinc-900/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg p-8'>
          <div className='mb-4'>
            <LockKeyhole className='w-10 h-10' />
          </div>
          <h3 className='text-zinc-100 text-base font-semibold mb-2'>
            Not Enough Logs
          </h3>
          <p className='text-zinc-400 text-sm mb-6 text-center'>
            Needs at least 20 notification logs to query with AI.
          </p>
          <a
            href='/dashboard'
            className='inline-flex text-sm items-center px-4 py-2 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors duration-200'
          >
            <svg
              className='w-4 h-4 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Back to Dashboard
          </a>
        </div>
      )}
    </div>
  );
}
