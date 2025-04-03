import React, { useState, useEffect } from 'react';
import { NoiseGradientBackground } from './noise-gradient-background';

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
    } as ThemeProps,
  },
];

export default function NoiseGradientShowcase() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showThemeInfo, setShowThemeInfo] = useState(true);

  // Auto-cycle through themes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentThemeIndex(prevIndex => (prevIndex + 1) % themes.length);
        setIsTransitioning(false);
      }, 1000); // Transition duration
    }, 5000); // Change theme every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle theme info display
  const toggleThemeInfo = () => {
    setShowThemeInfo(!showThemeInfo);
  };

  const currentTheme = themes[currentThemeIndex];

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Current theme background */}
      <NoiseGradientBackground {...currentTheme.props} />

      {/* Content */}
      <div
        className={`relative z-10 min-h-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className='text-center max-w-3xl mx-auto px-6'>
          <h1 className='text-6xl font-bold text-white mb-6'>Noise Gradient</h1>
          <p className='text-2xl text-white/80 mb-12'>
            Beautiful, customizable background effects for your next project
          </p>

          {/* Theme showcase */}
          <div className='mb-12'>
            <h2 className='text-4xl font-semibold text-white mb-2'>
              {currentTheme.name}
            </h2>
            <p className='text-xl text-white/70 mb-8'>
              {currentTheme.description}
            </p>

            {/* Visual theme counter */}
            <div className='flex justify-center space-x-2 mb-8'>
              {themes.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index === currentThemeIndex
                      ? 'bg-white scale-110'
                      : 'bg-white/30 scale-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex flex-wrap justify-center gap-4'>
            <button
              className='px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/20'
              onClick={toggleThemeInfo}
            >
              {showThemeInfo ? 'Hide Theme Info' : 'Show Theme Info'}
            </button>

            <a
              href='#code-examples'
              className='px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30'
            >
              View Code Examples
            </a>
          </div>
        </div>

        {/* Theme information panel */}
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

      {/* Code examples section */}
      <div
        id='code-examples'
        className='relative z-10 bg-black/50 backdrop-blur-md min-h-screen py-16'
      >
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-4xl font-bold text-white mb-8'>
            Implementation Examples
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Basic Usage */}
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
      {/* Default purple theme */}
      <NoiseGradientBackground />
      
      {/* Your content */}
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

            {/* Custom Colors */}
            <div className='bg-black/30 rounded-xl p-6 border border-white/10'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                Custom Colors
              </h3>
              <pre className='overflow-auto text-sm text-white/80 p-4 bg-black/20 rounded-lg'>
                {`<NoiseGradientBackground 
  primaryColor="blue-300/20"  // Tailwind color
  secondaryColor="rgba(123, 31, 162, 0.2)"  // RGBA
  tertiaryColor="#4a1d9e20"  // HEX with opacity
  noiseOpacity={50}
  vignetteIntensity="strong"
/>`}
              </pre>
            </div>

            {/* Animation Example */}
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

            {/* All Properties */}
            <div className='bg-black/30 rounded-xl p-6 border border-white/10'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                All Properties
              </h3>
              <pre className='overflow-auto text-sm text-white/80 p-4 bg-black/20 rounded-lg'>
                {`<NoiseGradientBackground 
  primaryColor="yellow-300/30"     // Primary color
  secondaryColor="amber-500/20"    // Secondary color
  tertiaryColor="orange-500/15"    // Tertiary color
  noiseSize={256}                  // Large noise size
  microNoiseSize={128}             // Small noise size
  noiseOpacity={60}                // Main noise opacity
  microNoiseOpacity={40}           // Micro noise opacity
  primaryBlur={80}                 // Primary blur amount
  secondaryBlur={60}               // Secondary blur amount
  tertiaryBlur={40}                // Tertiary blur amount
  vignetteIntensity="medium"       // Vignette strength
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
