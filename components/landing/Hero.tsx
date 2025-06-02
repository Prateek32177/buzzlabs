'use client';

import {
  BarChart3,
  CircleGauge,
  ChevronsUp,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { SupabaseLogo, ClerkLogo } from '../Logos';
import { StripeWordmarkLogo } from '@/components/Logos/StripeLogo';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { DodoLogo } from '../Logos/DodoPayments';
import { SignInDialog } from '@/components/auth/SIgnInDialog';
import { Button } from '../ui/button';
import { Spotlight } from './common/spotlight';

export default function Hero() {
  const iconClasses = 'w-5 h-5  transition-colors ';

  const icons = [
    <StripeWordmarkLogo
      key='stripe'
      className={`${iconClasses}`}
      style={{ scale: '0.7' }}
    />,
    <SupabaseLogo key='supabase' className={`${iconClasses} -ml-6`} />,
    <DodoLogo key='dodo' className={`${iconClasses}`} />,
    <GitHubLogoIcon key='github' className={iconClasses} />,
    <ClerkLogo key='clerk' className={`${iconClasses}`} />,
  ];

  return (
    <section className='relative min-h-screen antialiased flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <Spotlight />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:14px_24px] opacity-20' />

      <div className='absolute inset-0 z-5'>
        <div className='absolute top-1/4 left-0 w-16 sm:w-32 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent'></div>
        <div className='absolute top-3/4 right-0 w-16 sm:w-48 h-px bg-gradient-to-l from-transparent via-zinc-800 to-transparent'></div>
        <div className='absolute left-1/4 top-0 w-px h-16 sm:h-32 bg-gradient-to-b from-transparent via-zinc-800 to-transparent'></div>
        <div className='absolute right-1/4 bottom-0 w-px h-16 sm:h-48 bg-gradient-to-t from-transparent via-zinc-800 to-transparent'></div>
      </div>

      <div className='absolute top-4 sm:top-6 left-4 sm:left-6 z-5'>
        <Plus
          className='w-4 h-4 sm:w-6 sm:h-6 text-[#A692E5]'
          strokeWidth={1}
        />
      </div>
      <div className='absolute bottom-8 sm:bottom-12 right-6 sm:right-6 z-5'>
        <Plus
          className='w-4 h-4 sm:w-6 sm:h-6 text-[#A692E5]'
          strokeWidth={1}
        />
      </div>
      <div className='absolute bottom-8 sm:bottom-12 left-6 sm:left-6 z-5'>
        <Plus
          className='w-4 h-4 sm:w-6 sm:h-6 text-[#A692E5]'
          strokeWidth={1}
        />
      </div>

      <div className='relative z-20 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-40 pb-16 md:pb-8 px-4'>
        <section className='flex flex-col items-center lg:items-start text-center lg:text-left'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-4'
          >
            <Badge
              variant='outline'
              className='flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-zinc-700'
            >
              <ChevronsUp className='h-4 w-4 text-violet-300' />
              <span className='text-violet-400'>Hookflo Public Beta</span>
              <span className='hidden text-zinc-500 sm:inline'>
                is Now Live
              </span>
              <span className='inline text-zinc-500 sm:hidden'>is Live</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='text-4xl md:text-5xl font-light leading-tight tracking-tight text-white mb-3'
          >
            Transform{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-300'>
              events
            </span>{' '}
            into <br className='hidden sm:inline' />
            real time notifications
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='text-sm text-zinc-400 max-w-lg leading-relaxed mb-6'
          >
            Capture webhook events from any platform and instantly relay
            notifications across your favorite channels.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='flex flex-col items-center lg:items-start gap-1 mb-6 '
          >
            <span className='text-sm text-zinc-500 tracking-wide'>
              Flawlessly integrates with
            </span>
            <div className=' flex items-center gap-5 text-sm font-medium text-zinc-400 transition-all -ml-5'>
              {icons.map((icon, index) => (
                <span
                  key={index}
                  className='flex items-center gap-1 hover:text-zinc-100 transition-colors'
                >
                  {icon}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className='flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8'
          >
            <SignInDialog>
              <Button
                size='sm'
                className='group inline-flex h-9 items-center justify-center rounded-md bg-white px-4 text-sm text-zinc-900 transition-all duration-300 hover:bg-white/90 shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0)] hover:shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0)]'
              >
                <span className='relative z-10 flex items-center'>
                  Start Tracking Events
                  <ArrowUpRight className='ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                </span>
              </Button>
            </SignInDialog>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className='w-full max-w-sm sm:max-w-md'
          >
            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-4 backdrop-blur-sm text-left hover:border-zinc-700/50 hover:bg-zinc-950/70 transition-all duration-300'>
                <div className='flex items-center gap-2 text-violet-400 mb-2'>
                  <CircleGauge className='h-3.5 w-3.5' />
                  <span className='text-xs font-medium tracking-wide'>
                    Built for Speed
                  </span>
                </div>
                <div className='text-xl font-light text-white'>
                  plug & play{' '}
                </div>
                <div className='text-xs text-zinc-500 leading-relaxed'>
                  Set It. Forget It.
                </div>
              </div>

              <div className='rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-3 backdrop-blur-sm text-left hover:border-zinc-700/50 hover:bg-zinc-950/70 transition-all duration-300'>
                <div className='flex items-center gap-2 text-violet-400 mb-2'>
                  <BarChart3 className='h-3.5 w-3.5' />
                  <span className='text-xs font-medium tracking-wide'>
                    integration
                  </span>
                </div>
                <div className='text-xl font-light text-white'>in 5 mins</div>
                <div className='text-xs text-zinc-500 leading-relaxed'>
                  Instead of days spent on custom solution
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <WebhookTerminalCard />
      </div>
    </section>
  );
}

export function WebhookTerminalCard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [typedCode, setTypedCode] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [scanLine, setScanLine] = useState(-1);
  const [highlightLine, setHighlightLine] = useState(-1);

  const codeLines = [
    'const status = await checkHealth();',
    '',
    'if (status === "critical") {',
    '  fetch("https://hookflo.com/api/webhook/xxxx-12234", {',
    '    method: "POST",',
    '    body: JSON.stringify({',
    '      service: "payment-processor",',
    '      error: "Connection timeout"',
    '    })',
    '  });',
    '}',
  ];

  const fullCode = codeLines.join('\n');

  useEffect(() => {
    if (currentStep === 0) {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= fullCode.length) {
          setTypedCode(fullCode.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
          setCurrentStep(1);
        }
      }, 35);
      return () => clearInterval(timer);
    }
  }, [currentStep, fullCode]);

  useEffect(() => {
    if (currentStep === 1) {
      let lineIndex = 0;
      const timer = setInterval(() => {
        if (lineIndex < codeLines.length) {
          setScanLine(lineIndex);
          lineIndex++;
        } else {
          setScanLine(-1);
          setCurrentStep(2);
        }
      }, 180);
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2) {
      setHighlightLine(2);
      const timer = setTimeout(() => {
        setCurrentStep(3);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 3) {
      setHighlightLine(3);
      const timer = setTimeout(() => {
        setShowAlert(true);
        setCurrentStep(4);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const restartDemo = () => {
    setCurrentStep(0);
    setTypedCode('');
    setShowAlert(false);
    setScanLine(-1);
    setHighlightLine(-1);
  };

  const getSyntaxHighlight = (line: string) => {
    const leadingSpaces = line.match(/^(\s*)/)?.[0] || '';
    const indentation = leadingSpaces.replace(/ /g, '&nbsp;');
    const codeContent = line.substring(leadingSpaces.length);

    const highlighted = codeContent
      .replace(/"[^"]*"/g, '<span class="text-orange-400">$&</span>')
      .replace(
        /\b(const|await|if|fetch|method|body)\b/g,
        '<span class="text-purple-400">$1</span>',
      )
      .replace(
        /\b(checkHealth|JSON\.stringify)\b/g,
        '<span class="text-purple-400">$1</span>',
      )
      .replace(/\b(service|error)\b/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(status)\b/g, '<span class="text-zinc-300">$1</span>');

    return indentation + highlighted;
  };

  const renderCode = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const isScanning = scanLine === index;
      const isHighlighted = highlightLine === index;
      const isIfCondition = line.includes('if (status === "critical")');
      const isFetch = line.includes(
        'fetch("https://hookflo.com/api/webhook/xxxx-12234"',
      );

      return (
        <div
          key={index}
          className={`text-zinc-500 ${
            isScanning
              ? 'bg-blue-500/10 border-l-2 border-blue-400'
              : isHighlighted
                ? isIfCondition
                  ? 'bg-yellow-500/15 border-l-2 border-yellow-500'
                  : 'bg-green-500/15 border-l-2 border-green-500'
                : ''
          } transition-all duration-200 py-0.5 font-mono text-xs leading-relaxed overflow-x-auto `}
        >
          <span
            dangerouslySetInnerHTML={{ __html: getSyntaxHighlight(line) }}
          />
          {isHighlighted && isIfCondition && (
            <span className='ml-2 text-yellow-400 text-xs'>← Critical</span>
          )}
          {isHighlighted && isFetch && (
            <span className='ml-2 text-green-400 text-xs'>← Alert sent</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className='w-full'>
      <div className='relative bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 sm:p-4 shadow-lg'>
        <div className='flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800'>
          <div className='flex gap-1.5'>
            <div className='w-2 h-2 rounded-full bg-red-500'></div>
            <div className='w-2 h-2 rounded-full bg-yellow-400'></div>
            <div className='w-2 h-2 rounded-full bg-green-500'></div>
          </div>
          <span className='text-xs text-zinc-400 font-mono'>monitor.js</span>
        </div>

        <div className='font-mono text-xs leading-relaxed min-h-[200px]'>
          {currentStep === 0 ? (
            <div>
              {renderCode(typedCode)}
              <span className='animate-pulse text-zinc-300'>|</span>
            </div>
          ) : (
            renderCode(fullCode)
          )}
        </div>

        <div className='flex items-center gap-2 mt-3 pt-2 border-t border-zinc-800 justify-between'>
          <div className='flex items-center gap-2'>
            {!showAlert ? (
              <>
                <span className='relative flex size-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75'></span>
                  <span className='relative inline-flex size-2 rounded-full bg-yellow-500'></span>
                </span>
                <span className='text-xs text-zinc-400'>Monitoring</span>
              </>
            ) : (
              <>
                <span className='relative flex size-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex size-2 rounded-full bg-green-500'></span>
                </span>
                <span className='text-xs text-zinc-400'>
                  Alert sent on Email & Slack
                </span>
              </>
            )}
          </div>
          <span className='ml-auto text-xs text-violet-400'>hookflo</span>
        </div>

        <Button
          onClick={restartDemo}
          variant='ghost'
          size='sm'
          className='absolute top-1.5 right-1.5 text-zinc-500 hover:text-zinc-300 h-5 w-5 p-0 text-xs'
        >
          ↻
        </Button>
      </div>
    </div>
  );
}
