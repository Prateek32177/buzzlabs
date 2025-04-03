// src/examples/noise-gradient-examples.tsx
import React, { useState, useEffect } from 'react';
import { NoiseGradientBackground } from '@/components/ui/noise-gradient-background';

// Example 1: Basic Usage
export function BasicExample() {
  return (
    <div className='relative min-h-screen'>
      {/* Default purple theme */}
      <NoiseGradientBackground />

      {/* Content goes here */}
      <div className='relative z-10 p-8'>
        <h1 className='text-4xl font-bold text-white'>Basic Example</h1>
        <p className='text-white/80'>Using default configuration</p>
      </div>
    </div>
  );
}

// Example 2: Tailwind Color Classes
export function TailwindColors() {
  return (
    <>
      {/* Blue theme */}
      <div className='relative min-h-screen'>
        <NoiseGradientBackground
          primaryColor='blue-300/20'
          secondaryColor='blue-500/15'
          tertiaryColor='indigo-500/10'
          noiseOpacity={50}
          vignetteIntensity='strong'
        />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-white'>Blue Theme</h1>
          <p className='text-white/80'>Using Tailwind color classes</p>
        </div>
      </div>

      {/* Warm theme */}
      <div className='relative min-h-screen'>
        <NoiseGradientBackground
          primaryColor='yellow-300/30'
          secondaryColor='amber-500/20'
          tertiaryColor='orange-500/15'
          primaryBlur={90}
          secondaryBlur={70}
          vignetteIntensity='light'
        />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-white'>Warm Theme</h1>
          <p className='text-white/80'>Yellow and orange tones</p>
        </div>
      </div>

      {/* Green theme */}
      <div className='relative min-h-screen'>
        <NoiseGradientBackground
          primaryColor='emerald-300/20'
          secondaryColor='green-500/15'
          tertiaryColor='teal-600/10'
          noiseOpacity={40}
          microNoiseOpacity={30}
        />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-white'>Green Theme</h1>
          <p className='text-white/80'>Nature-inspired greens</p>
        </div>
      </div>
    </>
  );
}

// Example 3: Custom Colors (RGB, HEX, HSL)
export function CustomColors() {
  return (
    <>
      {/* RGB theme */}
      <div className='relative min-h-screen'>
        <NoiseGradientBackground
          primaryColor='rgba(255, 100, 50, 0.2)'
          secondaryColor='rgba(255, 50, 100, 0.15)'
          tertiaryColor='rgba(200, 50, 255, 0.1)'
          primaryBlur={100}
          microNoiseSize={64}
        />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-white'>RGB Colors</h1>
          <p className='text-white/80'>Using rgba() format</p>
        </div>
      </div>

      {/* HEX theme */}
      <div className='relative min-h-screen'>
        <NoiseGradientBackground
          primaryColor='#3b82f680'
          secondaryColor='#8b5cf640'
          tertiaryColor='#ec489930'
          vignetteIntensity='strong'
        />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-white'>HEX Colors</h1>
          <p className='text-white/80'>Using hex codes with opacity</p>
        </div>
      </div>

      {/* HSL theme */}
      <div className='relative min-h-screen'>
        <NoiseGradientBackground
          primaryColor='hsla(220, 80%, 60%, 0.2)'
          secondaryColor='hsla(280, 70%, 50%, 0.15)'
          tertiaryColor='hsla(330, 80%, 60%, 0.1)'
        />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-white'>HSL Colors</h1>
          <p className='text-white/80'>Using hsla() format</p>
        </div>
      </div>
    </>
  );
}

// Example 4: Mixed Color Formats
export function MixedColors() {
  return (
    <div className='relative min-h-screen'>
      <NoiseGradientBackground
        primaryColor='violet-400/30' // Tailwind color
        secondaryColor='rgba(123, 31, 162, 0.2)' // RGBA color
        tertiaryColor='#4a1d9e20' // HEX with opacity
        noiseOpacity={45}
      />
      <div className='relative z-10 p-8'>
        <h1 className='text-4xl font-bold text-white'>Mixed Color Formats</h1>
        <p className='text-white/80'>
          Combining Tailwind classes with custom colors
        </p>
      </div>
    </div>
  );
}

// Example 5: Animation with State
export function AnimatedExample() {
  const themes = [
    {
      name: 'Purple',
      primaryColor: 'purple-300/20',
      secondaryColor: 'purple-500/15',
      tertiaryColor: 'purple-500/10',
    },
    {
      name: 'Blue',
      primaryColor: 'blue-300/20',
      secondaryColor: 'blue-500/15',
      tertiaryColor: 'indigo-500/10',
    },
    {
      name: 'Green',
      primaryColor: 'emerald-300/20',
      secondaryColor: 'green-500/15',
      tertiaryColor: 'teal-600/10',
    },
    {
      name: 'Warm',
      primaryColor: 'yellow-300/30',
      secondaryColor: 'amber-500/20',
      tertiaryColor: 'orange-500/15',
    },
  ];

  const [currentTheme, setCurrentTheme] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTheme(prev => (prev + 1) % themes.length);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className='relative min-h-screen'>
      <NoiseGradientBackground
        {...themes[currentTheme]}
        className='transition-all duration-1000'
      />
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        <h1 className='text-4xl font-bold text-white mb-6'>
          {themes[currentTheme].name} Theme
        </h1>
        <p className='text-xl text-white/80 mb-8'>
          Click the button to animate between themes
        </p>
        <button
          onClick={nextTheme}
          className='px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all'
        >
          Next Theme
        </button>
      </div>
    </div>
  );
}

// Example 6: Configuring Vignette and Noise
export function VignetteAndNoiseExample() {
  const [vignetteIntensity, setVignetteIntensity] = useState('medium');
  const [noiseOpacity, setNoiseOpacity] = useState(60);

  return (
    <div className='relative min-h-screen'>
      <NoiseGradientBackground
        primaryColor='blue-300/20'
        secondaryColor='indigo-400/15'
        tertiaryColor='violet-500/10'
        vignetteIntensity={
          vignetteIntensity as 'none' | 'light' | 'medium' | 'strong'
        }
        noiseOpacity={noiseOpacity}
      />
      <div className='relative z-10 p-8 flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-4xl font-bold text-white mb-6'>
          Vignette & Noise Controls
        </h1>

        {/* Vignette Controls */}
        <div className='mb-8 w-full max-w-md'>
          <label className='block text-white mb-2'>Vignette Intensity</label>
          <div className='flex gap-2'>
            {['none', 'light', 'medium', 'strong'].map(intensity => (
              <button
                key={intensity}
                onClick={() => setVignetteIntensity(intensity)}
                className={`px-4 py-2 rounded-lg ${
                  vignetteIntensity === intensity
                    ? 'bg-white text-blue-500'
                    : 'bg-white/20 text-white'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        {/* Noise Opacity Control */}
        <div className='mb-8 w-full max-w-md'>
          <label className='block text-white mb-2'>
            Noise Opacity: {noiseOpacity}
          </label>
          <input
            type='range'
            min='0'
            max='100'
            value={noiseOpacity}
            onChange={e => setNoiseOpacity(parseInt(e.target.value))}
            className='w-full'
          />
        </div>
      </div>
    </div>
  );
}

// Example 7: Advanced - Animated Background
export function PulsingBackground() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale(s => (s === 1 ? 1.1 : 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <div
        className='transition-transform duration-3000'
        style={{ transform: `scale(${scale})` }}
      >
        <NoiseGradientBackground
          primaryColor='indigo-400/20'
          secondaryColor='fuchsia-500/15'
          tertiaryColor='purple-600/10'
          primaryBlur={100}
          secondaryBlur={80}
          tertiaryBlur={50}
        />
      </div>
      <div className='relative z-10 flex items-center justify-center min-h-screen'>
        <h1 className='text-5xl font-bold text-white text-center'>
          Breathing Animation Effect
        </h1>
      </div>
    </div>
  );
}

// All examples in one page
export default function AllExamples() {
  return (
    <div>
      <section id='basic'>
        <BasicExample />
      </section>

      <section id='tailwind'>
        <TailwindColors />
      </section>

      <section id='custom'>
        <CustomColors />
      </section>

      <section id='mixed'>
        <MixedColors />
      </section>

      <section id='animated'>
        <AnimatedExample />
      </section>

      <section id='controls'>
        <VignetteAndNoiseExample />
      </section>

      <section id='pulsing'>
        <PulsingBackground />
      </section>
    </div>
  );
}
