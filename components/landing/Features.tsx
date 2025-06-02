'use client';

import { Mail, CheckCircle2 } from 'lucide-react';

import { useEffect, useState, useRef } from 'react';
import { Blocks, WandSparkles } from 'lucide-react';
import { Lock, Unlock } from 'lucide-react';
import { SlackLogo, SupabaseLogo, ClerkLogo, PolarLogo } from '../Logos';
import { DodoLogo } from '../Logos/DodoPayments';
import { StripeLogo } from '@/components/Logos/StripeLogo';
import {
  CreditCardIcon,
  UsersIcon,
  BellAlertIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [chartData, setChartData] = useState([
    4, 7, 3, 8, 5, 9, 6, 10, 7, 5, 8, 11, 9, 6, 8,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        newData.shift();
        newData.push(Math.floor(Math.random() * 8) + 4);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const icons = [
    <SupabaseLogo className='w-6 h-6' />,
    <GitHubLogoIcon className='w-6 h-6' />,
    <ClerkLogo className='w-6 h-6 ' />,
    <PolarLogo className='w-6 h-6 ' />,
    <StripeLogo className='w-6 h-6 ' />,
    <SlackLogo className='w-12 h-12' />,
    <DodoLogo className='w-6 h-6' />,
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className=' text-white pb-16 pt-8 px-4 overflow-hidden'
    >
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-center mb-6'>
          <div
            className={`inline-flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-purple-400/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <Blocks className='w-4 h-4 text-purple-400' />
            <span className='text-purple-400 text-sm font-medium'>
              What you&apos;ll get
            </span>
          </div>
        </div>

        <div className='text-center mb-16'>
          <h2
            className={`text-3xl  text-white max-w-4xl mx-auto leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            We deliver real-time notifications
            <br /> for any event triggered by your favorite apps.
          </h2>
        </div>

        <div className='grid md:grid-cols-3 px-6 gap-6 mb-6'>
          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className='bg-zinc-900 rounded-lg p-4 mb-6 w-full max-w-[240px] mx-auto'>
              <div className='text-purple-400 font-medium mb-3'>Tracking</div>
              <div className='flex items-end h-24 gap-1.5'>
                {chartData.map((height, i) => (
                  <div
                    key={i}
                    className='w-2 bg-purple-400 rounded-full transition-all duration-500 ease-in-out'
                    style={{
                      height: `${height * 8}px`,
                      opacity: 0.5 + (i / chartData.length) * 0.5,
                      transform: `scaleY(${isVisible ? 1 : 0})`,
                      transitionDelay: `${i * 50}ms`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <h3 className='text-sm md:text-xl  font-medium mb-2'>
              Instant Tracking
            </h3>
            <p className='text-sm md:text-md text-zinc-400'>
              Monitor all database, payments, and other tracking event changes
              as they happen in real-time
            </p>
          </div>

          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className='bg-zinc-900 rounded-lg p-4 mb-6 w-full max-w-[240px] mx-auto'>
              <div className='px-4 opacity-50'>
                <div className='flex items-center gap-1.5'></div>
                <div className='text-white text-xs'>
                  {' '}
                  <span className='text-purple-400 text-xs'>NEW</span> Payment
                  received. you made 29$.
                </div>
                <div className='text-zinc-500 text-xs'>Today, 4:50</div>
              </div>{' '}
              <div className='flex items-center justify-center h-32'>
                <div className='bg-zinc-800 rounded-lg p-3 w-full max-w-[200px] transform transition-all duration-500 hover:scale-105'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-6 h-6 rounded-md bg-purple-400/20 flex items-center justify-center'>
                      <div className='w-4 h-4 flex items-center justify-center'>
                        <div className='w-3 h-3 bg-purple-400 rounded-sm rotate-45 animate-pulse'></div>
                      </div>
                    </div>
                    <div>
                      <div className='flex items-center gap-1.5'></div>
                      <div className='text-white text-sm'>
                        {' '}
                        <span className='text-purple-400 text-xs'>
                          NEW
                        </span>{' '}
                        User Joined
                      </div>
                      <div className='text-zinc-500 text-xs'>Today, 11:50</div>
                    </div>
                  </div>
                  <div className='border-t border-dashed border-zinc-700 my-2'></div>
                  <div className='h-2 bg-zinc-700/50 rounded-full w-full mb-2 animate-pulse'></div>
                  <div className='h-2 bg-zinc-700/50 rounded-full w-3/4'></div>
                </div>
              </div>
            </div>
            <h3 className='text-sm md:text-xl  mb-2'>Smart Notifications</h3>
            <p className='text-sm md:text-md text-zinc-400'>
              Get alerts delivered directly to your preferred channels - Slack
              or email
            </p>
          </div>

          <NotificationDigestCard />
        </div>

        <div className='grid md:grid-cols-2 gap-6 mb-8 px-6'>
          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <div className='flex flex-col md:flex-row'>
              <div className='flex-1'>
                <h3 className='text-sm md:text-xl   font-medium mb-2'>
                  Effortless Integration
                </h3>
                <p className='text-sm md:text-md  text-zinc-400 mb-6'>
                  Connect within minutes with your existing database, payment
                  tools, auth libraries and notification apps.
                </p>
              </div>

              <div className='px-4 grid grid-cols-4 md:grid-cols-3 gap-2 w-fit'>
                {icons.map((icon, index) => (
                  <div
                    key={index}
                    className='w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/10'
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      transform: isVisible
                        ? 'scale(1) rotate(0)'
                        : 'scale(0) rotate(-20deg)',
                      opacity: isVisible ? 1 : 0,
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SecurityReliabilityCard />
        </div>

        <div className='flex flex-wrap justify-center gap-4 mb-6'>
          {[
            'Slack Message Templates',
            'Email Templates',
            'Realtime Alert logs',
          ].map((text, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 transition-all duration-500 hover:border-purple-400/50 hover:bg-zinc-800 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${1200 + index * 100}ms` }}
            >
              <WandSparkles className='w-4 h-4 text-purple-400' />
              <span className='text-white text-sm'>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom Feature Pills */}
        <div className='flex flex-wrap justify-center gap-4'>
          {[
            'No library installation',
            'Direct Alerting from Dashboard',
            'Webhook Based Integration',
          ].map((text, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 transition-all duration-500 hover:border-purple-400/50 hover:bg-zinc-800 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${1600 + index * 100}ms` }}
            >
              <WandSparkles className='w-4 h-4 text-purple-400' />
              <span className='text-white text-sm'>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

function SecurityReliabilityCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), 300);
    const lockTimer = setTimeout(() => setIsLocked(true), 3000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(lockTimer);
    };
  }, []);

  return (
    <div
      className={`bg-zinc-900/60 rounded-xl h-full p-6 border border-zinc-800 transition-all duration-500 hover:border-emerald-400/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
      }`}
      style={{ transitionDelay: '300ms' }}
    >
      <div className='flex flex-col md:flex-row'>
        <div className='flex-1'>
          <h3 className='text-sm md:text-xl font-medium mb-2 text-white'>
            Secure & Reliable
          </h3>
          <p className='text-sm md:text-md text-zinc-400 mb-6'>
            Enterprise-grade security for your webhook infrastructure.
          </p>
        </div>

        <div className='flex-1 flex items-center justify-center relative p-8'>
          <div
            className={`absolute w-20 h-20 md:w-32 md:h-32 rounded-full transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className='absolute inset-0 rounded-full border-4 border-emerald-600/30 animate-spin-slow'></div>

            <div className='absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden'>
              <div className='absolute inset-0 bg-emerald-500/5'></div>

              <div className='relative z-10'>
                <div
                  className={`transition-all duration-500 ${isLocked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                >
                  <Lock
                    className='w-12 h-12 md:w-16 md:h-16 text-emerald-400'
                    strokeWidth={1.5}
                  />
                </div>
                <div
                  className={`absolute inset-0 transition-all duration-500 ${isLocked ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                >
                  <Unlock
                    className='w-12 h-12 md:w-16 md:h-16 text-red-600'
                    strokeWidth={1.5}
                  />
                </div>
                <div className='absolute inset-0 bg-emerald-400/30 filter blur-xl rounded-full animate-pulse-slow'></div>
              </div>
            </div>
          </div>

          <div className='absolute inset-0 overflow-hidden opacity-30'>
            <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FrequencyOption {
  label: string;
  times: string[];
}

interface NotificationStats {
  payments: number;
  users: number;
  deploys: number;
  alerts: number;
}

interface DigestSummary {
  title: string;
  stats: NotificationStats;
}

interface DigestContentProps {
  frequency: number;
}

export function NotificationDigestCard() {
  const [activeFrequency, setActiveFrequency] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(visibilityTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFrequency(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const frequencies = ['3× daily', '1× daily', 'Weekly'];
  const stats = [
    { icon: CreditCardIcon, label: 'payments', value: 8 },
    { icon: UsersIcon, label: 'users', value: 5 },
    { icon: BoltIcon, label: 'deploys', value: 3 },
    { icon: BellAlertIcon, label: 'alerts', value: 2 },
  ];

  return (
    <div
      className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: '300ms' }}
    >
      <div className='bg-zinc-900 rounded-lg p-4 mb-4 w-full max-w-[340px] mx-auto'>
        {/* Frequency Selector */}
        <div className='bg-zinc-800/50 rounded-lg p-2 mb-4'>
          <div className='relative h-8'>
            <div
              className='absolute h-8 bg-purple-400/20 rounded-full transition-all duration-500 ease-out'
              style={{
                left: `${activeFrequency * 33.33}%`,
                width: '33.33%',
              }}
            />
            <div className='absolute inset-0 flex'>
              {frequencies.map((freq, index) => (
                <div
                  key={index}
                  className='flex-1 flex items-center justify-center'
                >
                  <span
                    className={`text-sm font-medium z-10 ${
                      activeFrequency === index
                        ? 'text-purple-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    {freq}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-2'>
          {stats.map((item, index) => (
            <div
              key={index}
              className='bg-zinc-800/50 p-2 rounded-lg flex items-center gap-2'
            >
              <div className='w-8 h-8 rounded-full bg-purple-400/10 flex items-center justify-center'>
                <span>
                  <item.icon className='w-5 h-5 text-purple-400' />
                </span>
              </div>
              <div>
                <div className='text-base font-semibold text-white'>
                  {item.value}
                </div>
                <div className='text-xs text-zinc-400'>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between mt-3 text-xs'>
          <div className='flex items-center gap-1 text-purple-400'>
            <Mail className='h-3 w-3' />
            <span>Next: 9 AM</span>
          </div>
          <div className='flex items-center gap-1 text-zinc-400'>
            <CheckCircle2 className='h-3 w-3 text-green-400' />
            <span>Active</span>
          </div>
        </div>
      </div>

      <h3 className='text-sm md:text-xl font-medium mb-1'>Smart Digest</h3>
      <p className='text-sm text-zinc-400'>
        Get organized summaries at your preferred frequency
      </p>
    </div>
  );
}
