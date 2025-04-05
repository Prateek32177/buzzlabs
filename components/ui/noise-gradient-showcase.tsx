import React, { useState, useEffect } from 'react';
import { NoiseGradientBackground } from 'noise-gradient-bg';

// Define the specific types for vignetteIntensity
type VignetteIntensity = 'medium' | 'strong' | 'light' | 'none';

// Define the type for theme props to match NoiseGradientBackgroundProps
type ThemeProps = {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  noiseOpacity?: number;
  microNoiseOpacity?: number;
  primaryBlur?: number;
  secondaryBlur?: number;
  tertiaryBlur?: number;
  noiseSize?: number;
  microNoiseSize?: number;
  vignetteIntensity?: VignetteIntensity;
  theme?:
    | 'green'
    | 'zinc'
    | 'white'
    | 'purple'
    | 'blue'
    | 'yellow'
    | 'red'
    | 'custom'
    | 'gray';
};

// Theme configurations
const themes = [
  {
    name: 'Purple Haze',
    description: 'Default elegant purple theme',
    props: {
      primaryColor: 'purple-300/20',
      secondaryColor: 'purple-500/15',
      tertiaryColor: 'purple-500/10',
      theme: 'purple',
    } as ThemeProps,
  },
  {
    name: 'Ocean Blue',
    description: 'Calming blue gradients',
    props: {
      primaryColor: 'blue-300/20',
      secondaryColor: 'blue-500/15',
      tertiaryColor: 'indigo-500/10',
      noiseOpacity: 50,
      vignetteIntensity: 'strong' as VignetteIntensity,
      theme: 'blue',
    } as ThemeProps,
  },
  {
    name: 'Sunset Glow',
    description: 'Warm orange and yellow tones',
    props: {
      primaryColor: 'yellow-300/30',
      secondaryColor: 'amber-500/20',
      tertiaryColor: 'orange-500/15',
      primaryBlur: 90,
      secondaryBlur: 70,
      vignetteIntensity: 'light' as VignetteIntensity,
      theme: 'yellow',
    } as ThemeProps,
  },
  {
    name: 'Forest Depth',
    description: 'Rich green environment',
    props: {
      primaryColor: 'emerald-300/20',
      secondaryColor: 'green-500/15',
      tertiaryColor: 'teal-600/10',
      noiseOpacity: 40,
      microNoiseOpacity: 30,
      theme: 'green',
    } as ThemeProps,
  },
  {
    name: 'Vibrant Sunrise',
    description: 'Energetic reds and oranges',
    props: {
      primaryColor: 'rgba(255, 100, 50, 0.2)',
      secondaryColor: 'rgba(255, 50, 100, 0.15)',
      tertiaryColor: 'rgba(200, 50, 255, 0.1)',
      primaryBlur: 100,
      microNoiseSize: 64,
      theme: 'red',
    } as ThemeProps,
  },
  {
    name: 'Cosmic Blend',
    description: 'Space-inspired blue and purple',
    props: {
      primaryColor: '#3b82f680',
      secondaryColor: '#8b5cf640',
      tertiaryColor: '#ec489930',
      vignetteIntensity: 'strong' as VignetteIntensity,
      theme: 'custom',
    } as ThemeProps,
  },
  {
    name: 'Northern Lights',
    description: 'Aurora borealis inspired',
    props: {
      primaryColor: 'hsla(160, 80%, 60%, 0.2)',
      secondaryColor: 'hsla(200, 70%, 50%, 0.15)',
      tertiaryColor: 'hsla(280, 80%, 60%, 0.1)',
      noiseOpacity: 30,
      theme: 'custom',
    } as ThemeProps,
  },
  {
    name: 'Mixed Fusion',
    description: 'Combination of Tailwind and custom colors',
    props: {
      primaryColor: 'violet-400/30',
      secondaryColor: 'rgba(123, 31, 162, 0.2)',
      tertiaryColor: '#4a1d9e20',
      noiseOpacity: 45,
      theme: 'custom',
    } as ThemeProps,
  },
  {
    name: 'Emerald Mist',
    description: 'Soft emerald gradients with gentle blur',
    props: {
      primaryColor: 'emerald-200/30',
      secondaryColor: 'emerald-400/20',
      tertiaryColor: 'emerald-600/15',
      noiseOpacity: 35,
      primaryBlur: 85,
      vignetteIntensity: 'medium' as VignetteIntensity,
      theme: 'green',
    } as ThemeProps,
  },
  {
    name: 'Dark Elegance',
    description: 'Sophisticated dark theme with subtle noise',
    props: {
      primaryColor: 'zinc-800/50',
      secondaryColor: 'zinc-900/40',
      tertiaryColor: 'black/30',
      noiseOpacity: 30,
      microNoiseOpacity: 20,
      vignetteIntensity: 'strong' as VignetteIntensity,
      theme: 'zinc',
    } as ThemeProps,
  },
  {
    name: 'Ethereal White',
    description: 'Minimal white noise gradient for clean interfaces',
    props: {
      primaryColor: 'white/20',
      secondaryColor: 'white/15',
      tertiaryColor: 'white/10',
      noiseOpacity: 20,
      microNoiseOpacity: 15,
      vignetteIntensity: 'light' as VignetteIntensity,
      theme: 'white',
    } as ThemeProps,
  },
];

export default function NoiseGradientShowcase() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showThemeInfo, setShowThemeInfo] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  useEffect(() => {
    if (!autoplayEnabled) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentThemeIndex(prevIndex => (prevIndex + 1) % themes.length);
        setIsTransitioning(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplayEnabled]);

  const toggleThemeInfo = () => setShowThemeInfo(!showThemeInfo);
  const toggleAutoplay = () => setAutoplayEnabled(!autoplayEnabled);

  const goToTheme = (index: number) => {
    if (index === currentThemeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentThemeIndex(index);
      setIsTransitioning(false);
    }, 1000);
  };

  const currentTheme = themes[currentThemeIndex];

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <NoiseGradientBackground {...currentTheme.props} />

      <div
        className={`relative z-10 min-h-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className='text-center max-w-3xl mx-auto px-6'>
          <h1 className='text-6xl font-bold text-white mb-6'>Noise Gradient</h1>
          <p className='text-2xl text-white/80 mb-12'>
            Beautiful, customizable background effects for your next project
          </p>

          <div className='mb-12'>
            <h2 className='text-4xl font-semibold text-white mb-2'>
              {currentTheme.name}
            </h2>
            {showThemeInfo && (
              <p className='text-xl text-white/70 mb-8'>
                {currentTheme.description}
              </p>
            )}
            <div className='flex flex-wrap justify-center gap-2 mb-8'>
              {themes.map((theme, index) => (
                <button
                  key={index}
                  onClick={() => goToTheme(index)}
                  className={`h-3 w-12 rounded-full transition-all duration-300 ${
                    index === currentThemeIndex
                      ? 'bg-white scale-110'
                      : 'bg-white/30 scale-100 hover:bg-white/50'
                  }`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-wrap justify-center gap-4'>
            <button
              onClick={toggleThemeInfo}
              className='px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md'
            >
              {showThemeInfo ? 'Hide Info' : 'Show Info'}
            </button>
            <button
              onClick={toggleAutoplay}
              className='px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md'
            >
              {autoplayEnabled ? 'Pause Autoplay' : 'Resume Autoplay'}
            </button>
            <a
              href='#code-examples'
                           className='px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md'
            >
              View Code Examples
            </a>
          </div>
          </div>

          {showThemeInfo && (
            <div className='fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:bottom-6 md:w-96 bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 transition-all duration-500 animate-fadeIn'>
              <h3 className='text-xl font-semibold text-white mb-2'>
                Current Theme Configuration
              </h3>
              <pre className='overflow-auto text-sm text-white/80 p-3 bg-black/20 rounded-lg max-h-60'>
                {`// ${currentTheme.name}\n${JSON.stringify(currentTheme.props, null, 2)}`}
              </pre>
            </div>
          )}
          </div>

          <div
            id='code-examples'
            className='relative z-10 bg-black/50 backdrop-blur-md min-h-screen py-16'
          >
            <div className='max-w-5xl mx-auto px-6'>
              <h2 className='text-4xl font-bold text-white mb-8'>
                Implementation Examples
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='bg-black/30 rounded-xl p-6 border border-white/10'>
                  <h3 className='text-xl font-semibold text-white mb-4'>
                    Basic Usage
                  </h3>
                  <pre className='overflow-auto text-sm text-white/80 p-4 bg-black/20 rounded-lg'>
                    {`import { NoiseGradientBackground } from 
            "@/components/ui/noise-gradient-background";

          export default function Page() {
            return (
              <div className="relative min-h-screen">
                <NoiseGradientBackground />
                <div className="relative z-10 p-8">
                  <h1 className="text-4xl font-bold text-white">
                    Your Content Here
                  </h1>
                </div>
              </div>
            );
          }`}
                  </pre>
                </div>

                <div className='bg-black/30 rounded-xl p-6 border border-white/10'>
                  <h3 className='text-xl font-semibold text-white mb-4'>
                    Custom Colors
                  </h3>
                  <pre className='overflow-auto text-sm text-white/80 p-4 bg-black/20 rounded-lg'>
                    {`<NoiseGradientBackground 
            primaryColor="blue-300/20"
            secondaryColor="rgba(123, 31, 162, 0.2)"
            tertiaryColor="#4a1d9e20"
            noiseOpacity={50}
            vignetteIntensity="strong"
          />`}
                  </pre>
                </div>

                <div className='bg-black/30 rounded-xl p-6 border border-white/10'>
                  <h3 className='text-xl font-semibold text-white mb-4'>
                    With Animation
                  </h3>
                  <pre className='overflow-auto text-sm text-white/80 p-4 bg-black/20 rounded-lg'>
                    {`const [theme, setTheme] = useState({
            primaryColor: "purple-300/20",
            secondaryColor: "purple-500/15"
          });

          return (
            <div className="relative min-h-screen">
              <NoiseGradientBackground 
                {...theme}
                className="transition-all duration-1000"
              />
              <button onClick={() => setTheme({
                primaryColor: "blue-300/20",
                secondaryColor: "blue-500/15"
              })}>
                Change Theme
              </button>
            </div>
          );`}
                  </pre>
                </div>

                <div className='bg-black/30 rounded-xl p-6 border border-white/10'>
                  <h3 className='text-xl font-semibold text-white mb-4'>
                    All Properties
                  </h3>
                  <pre className='overflow-auto text-sm text-white/80 p-4 bg-black/20 rounded-lg'>
                    {`<NoiseGradientBackground 
            primaryColor="yellow-300/30"
            secondaryColor="amber-500/20"
            tertiaryColor="orange-500/15"
            noiseSize={256}
            microNoiseSize={128}
            noiseOpacity={60}
            microNoiseOpacity={40}
            primaryBlur={80}
            secondaryBlur={60}
            tertiaryBlur={40}
            vignetteIntensity="medium"
          />`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
