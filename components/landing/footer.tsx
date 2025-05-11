import { Logo } from '../Logo';
import { Mail, Slack } from 'lucide-react';

export function Footer() {
  return (
    <footer className='bg-[#0A0A0B] py-10 px-4 border-t border-white/5 gradient-background'>
      <div className='container mx-auto max-w-6xl'>
        <div className='flex flex-col md:flex-row justify-between gap-8 mb-8'>
          {/* Logo and description */}
          <div className='max-w-xs'>
            <div className='mb-4'>
              <Logo size='text-2xl' />
            </div>
            <p className='text-white/70 text-sm'>
              Building no-code quick to setup event tracking system for your
              apps.
            </p>
          </div>

          {/* Support icons - now on the right */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <p className='text-sm whitespace-nowrap text-gray-400'>
              Get Support on
            </p>
            <div className='flex items-center gap-4'>
              {/* <a
                href="https://join.slack.com/t/hookflo/shared_invite/zt-33uwanhdy-pLIpr5w_XYwzFj4eq3NDow"
                title="Join our Slack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300/70 hover:text-white transition-colors"
              >
                <Slack size={20} />
              </a> */}
              <a
                href='https://discord.gg/SNmCjU97nr'
                title='Join our Discord'
                target='_blank'
                rel='noopener noreferrer'
                className='text-purple-300/70 hover:text-white transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={20}
                  height={20}
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612' />
                </svg>
              </a>
              <a
                href='mailto:team.hookflo@gmail.com'
                title='Email support'
                className='text-purple-300/70 hover:text-white transition-colors'
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and links */}
        <div className='border-t border-white/5 pt-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-2'>
            <p className='text-white/70 text-sm order-2 sm:order-1'>
              © 2025 Hookflo. All rights reserved.
            </p>
            {/* <div className='flex gap-4 order-1 sm:order-2 mb-4 sm:mb-0'>
              <a
                href='#'
                className='text-white/70 hover:text-white transition-colors text-sm'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='text-white/70 hover:text-white transition-colors text-sm'
              >
                Terms of Service
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
