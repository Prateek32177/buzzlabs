// src/components/ui/noise-gradient-background.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface NoiseGradientBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Primary gradient color
   * Accepts Tailwind classes (e.g., "purple-500", "yellow-300/50") or custom colors (HEX, RGB, RGBA, HSL)
   */
  primaryColor?: string;
  /**
   * Secondary gradient color
   * Accepts Tailwind classes (e.g., "purple-500", "yellow-300/50") or custom colors (HEX, RGB, RGBA, HSL)
   */
  secondaryColor?: string;
  /**
   * Optional tertiary gradient color
   * Accepts Tailwind classes (e.g., "purple-500", "yellow-300/50") or custom colors (HEX, RGB, RGBA, HSL)
   */
  tertiaryColor?: string;
  /** Controls the large noise pattern size (default: 256px) */
  noiseSize?: number;
  /** Controls the micro noise pattern size (default: 128px) */
  microNoiseSize?: number;
  /** Controls the opacity of the main noise overlay (0-100) */
  noiseOpacity?: number;
  /** Controls the opacity of the micro noise overlay (0-100) */
  microNoiseOpacity?: number;
  /** Controls primary blur amount (default: 80px) */
  primaryBlur?: number;
  /** Controls secondary blur amount (default: 60px) */
  secondaryBlur?: number;
  /** Controls tertiary blur amount (default: 40px) */
  tertiaryBlur?: number;
  /** Controls the vignette intensity */
  vignetteIntensity?: 'none' | 'light' | 'medium' | 'strong';
  theme?:
    | 'purple'
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'gray'
    | 'white'
    | 'zinc'
    | 'custom';
}

const gradientClasses = {
  purple: {
    strong: 'from-purple-500/20 via-purple-400/10',
    medium: 'from-purple-400/15 via-purple-300/5',
    light: 'from-purple-300/10 via-purple-200/5',
  },
  blue: {
    strong: 'from-blue-500/20 via-blue-400/10',
    medium: 'from-blue-400/15 via-blue-300/5',
    light: 'from-blue-300/10 via-blue-200/5',
  },
  green: {
    strong: 'from-emerald-500/20 via-emerald-400/10',
    medium: 'from-emerald-400/15 via-emerald-300/5',
    light: 'from-emerald-300/10 via-emerald-200/5',
  },
  red: {
    strong: 'from-rose-500/20 via-rose-400/10',
    medium: 'from-rose-400/15 via-rose-300/5',
    light: 'from-rose-300/10 via-rose-200/5',
  },
  yellow: {
    strong: 'from-yellow-500/20 via-yellow-400/10',
    medium: 'from-yellow-400/15 via-yellow-300/5',
    light: 'from-yellow-300/10 via-yellow-200/5',
  },
  gray: {
    strong: 'from-gray-500/20 via-gray-400/10',
    medium: 'from-gray-400/15 via-gray-300/5',
    light: 'from-gray-300/10 via-gray-200/5',
  },
  white: {
    strong: 'from-white/20 via-white/10',
    medium: 'from-white/15 via-white/5',
    light: 'from-white/10 via-white/5',
  },
  zinc: {
    strong: 'from-zinc-500/20 via-zinc-400/10',
    medium: 'from-zinc-400/15 via-zinc-300/5',
    light: 'from-zinc-300/10 via-zinc-200/5',
  },
  custom: {
    strong: '',
    medium: '',
    light: '',
  },
};

const NoiseGradientBackground = ({
  primaryColor = 'purple-500/20',
  secondaryColor = 'purple-400/15',
  tertiaryColor = 'purple-300/10',
  theme = 'purple',
  noiseSize = 256,
  microNoiseSize = 128,
  noiseOpacity = 60,
  microNoiseOpacity = 40,
  primaryBlur = 80,
  secondaryBlur = 60,
  tertiaryBlur = 40,
  vignetteIntensity = 'strong',
  className,
  children,
  ...props
}: NoiseGradientBackgroundProps) => {
  // Ensure theme exists in gradientClasses, otherwise use 'purple'
  const safeTheme = theme in gradientClasses ? theme : 'purple';

  const isCustomColor = (color: string): boolean => {
    return (
      color.startsWith('#') ||
      color.startsWith('rgb') ||
      color.startsWith('hsl') ||
      color.startsWith('rgba') ||
      color.startsWith('hsla')
    );
  };

  const getGradientStyle = (color: string, blur: number) => {
    if (isCustomColor(color)) {
      return {
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        filter: `blur(${blur}px)`,
      };
    }
    return { filter: `blur(${blur}px)` };
  };

  const generateGradientClass = (
    fromColor: string,
    viaColor: string,
    toColor: string = 'transparent',
  ) => {
    if (
      !isCustomColor(fromColor) &&
      !isCustomColor(viaColor) &&
      !isCustomColor(toColor)
    ) {
      return `bg-gradient-to-b from-${fromColor} via-${viaColor} to-${toColor}`;
    }
    return '';
  };

  const getVignetteSettings = () => {
    switch (vignetteIntensity) {
      case 'none':
        return { opacity: 0 };
      case 'light':
        return {
          background: `radial-gradient(90% 100% at 50% 0%, transparent 20%, rgba(0, 0, 0, 0.2) 50%, rgba(1, 1, 2, 0.5) 80%)`,
        };
      case 'strong':
        return {
          background: `radial-gradient(90% 100% at 50% 0%, transparent 5%, rgba(0, 0, 0, 0.5) 30%, rgba(1, 1, 2, 0.9) 70%)`,
        };
      case 'medium':
        return {
          background: `radial-gradient(90% 100% at 50% 0%, transparent 10%, rgba(0, 0, 0, 0.3) 40%, rgba(1, 1, 2, 0.7) 75%)`,
        };
      default:
        return {
          background: `radial-gradient(
            80% 100% at 50% 0%,
            transparent 10%,
            rgba(24, 24, 27, 0.4) 50%,
            rgba(24, 24, 27, 0.8) 100%
          )`,
        };
    }
  };

  const primaryGradientClass = generateGradientClass(
    primaryColor,
    secondaryColor,
  );
  const secondaryGradientClass = generateGradientClass(
    secondaryColor,
    tertiaryColor,
  );
  const tertiaryGradientClass = generateGradientClass(
    tertiaryColor,
    tertiaryColor,
  );

  return (
    <div
      className={cn('fixed inset-0 overflow-hidden', className)}
      aria-hidden='true'
      {...props}
    >
      {/* Noise layers */}
      <div
        className={`absolute inset-0 opacity-${noiseOpacity} mix-blend-overlay`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.975' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${noiseSize}px ${noiseSize}px`,
        }}
      />

      {/* Micro noise overlay */}
      <div
        className={`absolute inset-0 opacity-${microNoiseOpacity} mix-blend-soft-light`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='microNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23microNoiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${microNoiseSize}px ${microNoiseSize}px`,
        }}
      />

      {/* Gradient layers */}
      <div className='absolute top-0 left-0 w-full h-full'>
        {/* Strong gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b to-transparent',
            safeTheme !== 'custom' && gradientClasses[safeTheme].strong,
          )}
          style={
            safeTheme === 'custom'
              ? getGradientStyle(primaryColor, primaryBlur)
              : { filter: `blur(${primaryBlur}px)` }
          }
        />

        {/* Medium gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b to-transparent',
            safeTheme !== 'custom' && gradientClasses[safeTheme].medium,
          )}
          style={
            safeTheme === 'custom'
              ? getGradientStyle(secondaryColor, secondaryBlur)
              : { filter: `blur(${secondaryBlur}px)` }
          }
        />

        {/* Light gradient */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b to-transparent',
            safeTheme !== 'custom' && gradientClasses[safeTheme].light,
          )}
          style={
            safeTheme === 'custom'
              ? getGradientStyle(tertiaryColor, tertiaryBlur)
              : { filter: `blur(${tertiaryBlur}px)` }
          }
        />

        {/* Vignette effect */}
        <div
          className='w-full absolute inset-0'
          style={getVignetteSettings()}
        />
      </div>

      {/* Additional overlays */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/10 to-zinc-900/30' />

      {children}
    </div>
  );
};

export { NoiseGradientBackground };
