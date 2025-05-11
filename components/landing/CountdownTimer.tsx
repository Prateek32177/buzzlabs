import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
interface CountdownTimerProps {
  compact?: boolean;
}

export function CountdownTimer({ compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);
    const targetDate = tomorrow;

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='mx-auto mb-6 w-fit px-4 py-3 rounded-xl border border-purple-300/20 bg-zinc-900/60 backdrop-blur-sm shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05)] hover:shadow-purple-500/10 transition-all duration-300 flex items-center flex-col gap-2'
    >
      <span className='text-xs sm:text-base font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-purple-400 tracking-wide'>
        Hookflo 1.0 releasing in
      </span>

      <div className='flex items-center gap-2'>
        {[
          { value: timeLeft.days, label: 'day' },
          { value: timeLeft.hours, label: 'hour' },
          { value: timeLeft.minutes, label: 'min' },
          { value: timeLeft.seconds, label: 'sec' },
        ].map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className='flex flex-col items-center'>
              <motion.span
                key={unit.value}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className='text-sm sm:text-base font-mono font-semibold text-transparent bg-clip-text bg-gradient-to-b from-purple-100 to-purple-400'
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.span>
              <span className='text-[10px] uppercase font-mono text-purple-300/60 tracking-wider -mt-0.5'>
                {unit.label}
              </span>
            </div>
            {index < 3 && (
              <span className='text-purple-500/40 text-base font-light'>:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}
