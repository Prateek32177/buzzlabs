'use client';

import { useEffect, useState, useRef } from 'react';
import { CircleAlert } from 'lucide-react';
import {
  SlackLogo,
  SupabaseLogo,
  ClerkLogo,
  PolarLogo,
  LoopsLogo,
  ResendLogo,
  TeamsLogo,
} from '../Logos';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [chartData, setChartData] = useState([
    4, 7, 3, 8, 5, 9, 6, 10, 7, 5, 8, 11, 9, 6, 8,
  ]);

  // Animation for chart data
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        // Remove first element and add a new random one at the end
        newData.shift();
        newData.push(Math.floor(Math.random() * 8) + 4); // Random number between 4-12
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const icons = [
    <SupabaseLogo className='w-6 h-6' />,
    <ClerkLogo className='w-6 h-6 ' />,
    <PolarLogo className='w-6 h-6 ' />,
    <LoopsLogo className='w-6 h-6 ' />,
    <SlackLogo className='w-12 h-12' />,
    <ResendLogo className='w-12 h-12 ' />,
    <TeamsLogo className='w-6 h-6 text-indigo-400 ' />,
  ];

  // Intersection observer to trigger animations when section is visible
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
      className='bg-black text-white py-16 px-4 overflow-hidden'
    >
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-center mb-6'>
          <div
            className={`inline-flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-purple-400/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <CircleAlert className='w-4 h-4 text-purple-400 animate-pulse' />
            <span className='text-purple-400 text-sm font-medium'>
              What you&apos;ll get
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className='text-center mb-16'>
          <h2
            className={`text-4xl md:text-5xl font-medium text-white max-w-4xl mx-auto leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            We deliver Real-time notifications on
            <br /> your database activities.
          </h2>
        </div>

        {/* Top Row Features */}
        <div className='grid md:grid-cols-3 gap-6 mb-6'>
          {/* Instant Tracking */}
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
            <h3 className='text-xl font-medium mb-2'>Instant Tracking</h3>
            <p className='text-zinc-400'>
              Monitor all database changes as they happen in real-time
            </p>
          </div>

          {/* Smart Notifications */}
          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className='bg-zinc-900 rounded-lg p-4 mb-6 w-full max-w-[240px] mx-auto'>
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
            <h3 className='text-xl font-medium mb-2'>Smart Notifications</h3>
            <p className='text-zinc-400'>
              Get alerts delivered directly to your preferred channels - Slack
              or email
            </p>
          </div>

          {/* Scalable */}
          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className='bg-zinc-900 rounded-lg p-4 mb-6 w-full max-w-[240px] mx-auto'>
              <div className='h-32 flex items-center justify-center'>
                <svg
                  width='200'
                  height='100'
                  viewBox='0 0 200 100'
                  className='w-full'
                >
                  <defs>
                    <filter id='glow'>
                      <feGaussianBlur stdDeviation='7' result='blur' />
                      <feComposite
                        in='SourceGraphic'
                        in2='blur'
                        operator='over'
                      />
                    </filter>
                    <linearGradient
                      id='graphGradient'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='0%'
                    >
                      <stop offset='0%' stopColor='#a5f3b8' stopOpacity='0.7' />
                      <stop
                        offset='100%'
                        stopColor='#a5f9g8'
                        stopOpacity='0.9'
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d='M 10,80 Q 52.5,80 75,60 T 120,50 T 180,10'
                    fill='none'
                    stroke='url(#graphGradient)'
                    strokeWidth='2'
                    strokeDasharray='220'
                    strokeDashoffset={isVisible ? '0' : '220'}
                    style={{
                      transition: 'stroke-dashoffset 2s ease-in-out',
                    }}
                  />

                  <path
                    d='M 10,80 Q 52.5,80 75,60 T 120,50 T 180,10'
                    fill='none'
                    stroke='#a5f3b8'
                    strokeWidth='2.5'
                    strokeDasharray='220'
                    strokeDashoffset={isVisible ? '0' : '220'}
                    style={{
                      transition: 'stroke-dashoffset 2s ease-in-out',
                    }}
                  />
                  <circle
                    cx='180'
                    cy='10'
                    r='4'
                    fill='#a77ffa'
                    className={``}
                  />
                  <circle
                    cx='180'
                    cy='10'
                    r='7'
                    fill='#a78bfa'
                    className={`animate-pulse`}
                  />
                </svg>
              </div>
            </div>
            <h3 className='text-xl font-medium mb-2'>Scalable as you grow</h3>
            <p className='text-zinc-400'>
              We&apos;re ready to meet your evolving needs.
            </p>
          </div>
        </div>

        {/* Bottom Row Features */}
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          {/* Effortless Integration */}
          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <div className='flex flex-col md:flex-row'>
              <div className='flex-1'>
                <h3 className='text-xl font-medium mb-2'>
                  Effortless Integration
                </h3>
                <p className='text-zinc-400 mb-6'>
                  Connect within minutes with your existing database, payment
                  tools, auth libraries and notification apps.
                </p>
              </div>

              <div className='px-4 grid grid-cols-3 gap-2'>
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

          {/* Custom constraints */}
          <div
            className={`bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className='flex flex-col md:flex-row'>
              <div className='flex-1'>
                <h3 className='text-xl font-medium mb-2'>Secure & Reliable</h3>
                <p className='text-zinc-400 mb-6'>
                  Enterprise-grade security for your webhook infrastructure.
                </p>
              </div>
              <div className='flex-1 flex items-center justify-center'>
                <div className='relative w-32 h-16'>
                  <div
                    className={`absolute w-16 h-16 bg-purple-500 rounded-full opacity-80 left-0 transition-all duration-1000 ${isVisible ? 'transform-none' : 'scale-0 -translate-x-8'}`}
                    style={{ filter: 'blur(8px)' }}
                  ></div>
                  <div
                    className='absolute w-16 h-16 bg-purple-500 rounded-full opacity-80 left-0 transition-all duration-1000'
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0)',
                      transitionDelay: '200ms',
                    }}
                  ></div>
                  <div
                    className={`absolute w-16 h-16 bg-blue-400 rounded-full opacity-80 left-8 top-0 transition-all duration-1000 ${isVisible ? 'transform-none' : 'scale-0 -translate-y-8'}`}
                    style={{
                      filter: 'blur(8px)',
                      transitionDelay: '400ms',
                    }}
                  ></div>
                  <div
                    className='absolute w-16 h-16 bg-blue-400 rounded-full opacity-80 left-8 top-0 transition-all duration-1000'
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0)',
                      transitionDelay: '600ms',
                    }}
                  ></div>
                  <div
                    className={`absolute w-16 h-16 bg-yellow-300 rounded-full opacity-80 left-16 top-0 transition-all duration-1000 ${isVisible ? 'transform-none' : 'scale-0 translate-x-8'}`}
                    style={{
                      filter: 'blur(8px)',
                      transitionDelay: '800ms',
                    }}
                  ></div>
                  <div
                    className='absolute w-16 h-16 bg-yellow-300 rounded-full opacity-80 left-16 top-0 transition-all duration-1000'
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0)',
                      transitionDelay: '1000ms',
                    }}
                  ></div>
                  <div
                    className={`absolute w-16 h-16 bg-zinc-700 rounded-full opacity-50 left-24 top-0 transition-all duration-1000 ${isVisible ? 'transform-none' : 'scale-0 translate-y-8'}`}
                    style={{
                      filter: 'blur(8px)',
                      transitionDelay: '1200ms',
                    }}
                  ></div>
                  <div
                    className='absolute w-16 h-16 bg-zinc-700 rounded-full opacity-50 left-24 top-0 transition-all duration-1000'
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0)',
                      transitionDelay: '1400ms',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className='flex flex-wrap justify-center gap-4 mb-6'>
          {['Slack Message Templates', 'Email Templates', 'Manage Alerts'].map(
            (text, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 transition-all duration-500 hover:border-purple-400/50 hover:bg-zinc-800 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${1200 + index * 100}ms` }}
              >
                <CircleAlert className='w-4 h-4 text-purple-400' />
                <span className='text-white text-sm'>{text}</span>
              </div>
            ),
          )}
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
              <CircleAlert className='w-4 h-4 text-purple-400' />
              <span className='text-white text-sm'>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Background particles */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className='absolute w-1 h-1 rounded-full bg-purple-400/30'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: isVisible ? 0.3 + Math.random() * 0.5 : 0,
              transform: `scale(${0.5 + Math.random() * 2})`,
              filter: `blur(${Math.random() * 2}px)`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transition: 'opacity 1s ease-in-out',
              transitionDelay: `${1000 + i * 100}ms`,
            }}
          />
        ))}
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
