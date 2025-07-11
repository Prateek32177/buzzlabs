'use client';

import { BarChart3, CircleGauge, ChevronsUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SupabaseLogo, ClerkLogo } from '../Logos';
import { StripeWordmarkLogo } from '@/components/Logos/StripeLogo';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { DodoLogo } from '../Logos/DodoPayments';
import { SignInDialog } from '@/components/auth/SIgnInDialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { NoiseGradientBackground } from 'noise-gradient-bg';
import { Playfair_Display } from 'next/font/google';

const playfairItalic = Playfair_Display({
  subsets: ['latin'],
  style: 'italic',
  weight: '400',
});

export default function Hero() {
  const iconClasses = 'w-5 h-5';

  const icons = [
    <StripeWordmarkLogo
      key='stripe'
      className={`${iconClasses}`}
      style={{ scale: '0.7' }}
    />,
    <SupabaseLogo key='supabase' className={`${iconClasses} -ml-6`} />,
    <DodoLogo key='dodo' className={iconClasses} />,
    <GitHubLogoIcon key='github' className={iconClasses} />,
    <ClerkLogo key='clerk' className={iconClasses} />,
  ];

  return (
    <section className='relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <NoiseGradientBackground vignetteIntensity='strong' theme='zinc' />

      <div className='relative z-20 max-w-sm md:max-w-6xl  w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-40 pb-16 md:pb-8'>
        <section className='flex flex-col items-center lg:items-start text-center lg:text-left'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-6'
          >
            <Badge
              variant='outline'
              className='flex items-center gap-1.5 rounded-full border border-zinc-800/60 bg-zinc-950/50 px-3 py-1.5 text-xs text-zinc-300 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-950/95'
            >
              <ChevronsUp className='h-4 w-4 text-violet-400' />
              <span className='text-violet-400'>
                Alert, monitor, and debug{' '}
              </span>
              <span className='hidden text-zinc-400 sm:inline'>
                with confidence
              </span>
              <span className='inline text-zinc-400 sm:hidden'>
                with confidence
              </span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='text-3xl sm:text-5xl leading-[1.15] tracking-tight text-white mb-4'
          >
            Centralized{' '}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#d946ef] to-[#0ea5e9] rotate-[1deg] inline-block ${playfairItalic.className} text-4xl sm:text-6xl`}
            >
              event
            </span>{' '}
            logging and alerting for modern stacks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed mb-8'
          >
            From real time alerts to AI powered log analysis, Hookflo helps you
            capture, monitor, and debug every event instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className='flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4'
          >
            <SignInDialog>
              <Button
                size='sm'
                className='group inline-flex h-10 items-center justify-center rounded-lg bg-white px-6 text-sm font-medium text-zinc-900 transition-all hover:bg-white/95 hover:shadow-lg ring-1 ring-zinc-300/50 hover:-translate-y-0.5 duration-300'
              >
                <span className='relative z-10 flex items-center'>
                  Start Monitoring
                  <ArrowUpRight className='ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300' />
                </span>
              </Button>
            </SignInDialog>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='flex flex-col items-center lg:items-start gap-2 mb-8'
          >
            <span className='text-sm text-zinc-500 tracking-wide font-medium'>
              Flawlessly integrates with
            </span>
            <div className='flex items-center gap-6 text-sm font-medium text-zinc-400 transition-all -ml-5'>
              {icons.map((icon, index) => (
                <span
                  key={index}
                  className='flex items-center gap-1 hover:text-zinc-200 transition-colors duration-300'
                >
                  {icon}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className='w-full max-w-sm sm:max-w-md'
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-4 backdrop-blur-sm hover:border-zinc-700/60 hover:bg-zinc-950/80 group text-left'>
                <div className='flex items-center gap-2 text-violet-400 mb-3'>
                  <CircleGauge className='h-4 w-4 group-hover:scale-110 transition-transform' />
                  <span className='text-xs font-medium tracking-tight'>
                    Real Time Alerts
                  </span>
                </div>
                <div className='text-base font-light text-white mb-1 tracking-tight'>
                  Slack, Email & more
                </div>
                <div className='text-xs text-zinc-500 leading-relaxed'>
                  Stay instantly informed
                </div>
              </div>

              <div className='rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-4 backdrop-blur-sm hover:border-zinc-700/60 hover:bg-zinc-950/80 group text-left'>
                <div className='flex items-center gap-2 text-violet-400 mb-3'>
                  <BarChart3 className='h-4 w-4 group-hover:scale-110 transition-transform' />
                  <span className='text-xs font-medium tracking-tight'>
                    AI Powered Logs
                  </span>
                </div>
                <div className='text-base font-light text-white mb-1 tracking-tight'>
                  Smarter debugging
                </div>
                <div className='text-xs text-zinc-500'>
                  Search, analyze & fix fast
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
            <span className='ml-2 text-yellow-400 text-xs font-medium'>
              ← Critical
            </span>
          )}
          {isHighlighted && isFetch && (
            <span className='ml-2 text-green-400 text-xs font-medium'>
              ← Alert sent
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div className='max-w-screen-sm mx-auto w-full'>
      <div className='relative bg-zinc-950/30 border border-zinc-400/10 rounded-xl p-4 shadow-2xl backdrop-blur-md'>
        <div className='flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/60'>
          <div className='flex gap-1.5'>
            <div className='w-2.5 h-2.5 rounded-full bg-red-500'></div>
            <div className='w-2.5 h-2.5 rounded-full bg-yellow-400'></div>
            <div className='w-2.5 h-2.5 rounded-full bg-green-500'></div>
          </div>
          <span className='text-xs text-zinc-400 font-mono ml-2'>
            monitor.js
          </span>
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

        <div className='flex items-center gap-3 mt-4 pt-3 border-t border-zinc-800/60 justify-between'>
          <div className='flex items-center gap-2'>
            {!showAlert ? (
              <>
                <span className='relative flex size-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75'></span>
                  <span className='relative inline-flex size-2 rounded-full bg-yellow-500'></span>
                </span>
                <span className='text-xs text-zinc-400 font-medium'>
                  Monitoring
                </span>
              </>
            ) : (
              <>
                <span className='relative flex size-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex size-2 rounded-full bg-green-500'></span>
                </span>
                <span className='text-xs text-zinc-400 font-medium'>
                  Alert sent on Email & Slack
                </span>
              </>
            )}
          </div>
          <span className='ml-auto text-xs text-violet-400 font-semibold'>
            hookflo
          </span>
        </div>

        <Button
          onClick={restartDemo}
          variant='ghost'
          size='sm'
          className='absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 h-6 w-6 p-0 text-sm rounded-md hover:bg-zinc-800/50 transition-all duration-200'
        >
          ↻
        </Button>
      </div>
    </div>
  );
}
