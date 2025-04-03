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
}

const NoiseGradientBackground = ({
  primaryColor = 'purple-300/20',
  secondaryColor = 'purple-500/15',
  tertiaryColor = 'purple-500/10',
  noiseSize = 256,
  microNoiseSize = 128,
  noiseOpacity = 60,
  microNoiseOpacity = 40,
  primaryBlur = 80,
  secondaryBlur = 60,
  tertiaryBlur = 40,
  vignetteIntensity = 'medium',
  className,
  children,
  ...props
}: NoiseGradientBackgroundProps) => {
  // Determine if a color is a custom color (HEX, RGB, etc.) or a Tailwind class
  const isCustomColor = (color: string): boolean => {
    return (
      color.startsWith('#') ||
      color.startsWith('rgb') ||
      color.startsWith('hsl') ||
      color.startsWith('rgba') ||
      color.startsWith('hsla')
    );
  };

  // Generate gradient CSS for both custom colors and Tailwind classes
  const generateGradientStyle = (
    fromColor: string,
    viaColor: string,
    toColor: string = 'transparent',
  ) => {
    if (
      isCustomColor(fromColor) ||
      isCustomColor(viaColor) ||
      isCustomColor(toColor)
    ) {
      // Handle custom colors with inline style
      return {
        backgroundImage: `linear-gradient(to bottom, ${fromColor}, ${viaColor}, ${toColor})`,
      };
    }

    // Return empty object for Tailwind classes (handled by className)
    return {};
  };

  // Generate gradient className for Tailwind colors
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

  // Determine vignette settings based on intensity
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
      default:
        return {
          background: `radial-gradient(90% 100% at 50% 0%, transparent 10%, rgba(0, 0, 0, 0.4) 40%, rgba(1, 1, 2, 0.8) 60%)`,
        };
    }
  };

  // Generate gradient classes and styles
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

  const primaryGradientStyle = generateGradientStyle(
    primaryColor,
    secondaryColor,
  );
  const secondaryGradientStyle = generateGradientStyle(
    secondaryColor,
    tertiaryColor,
  );
  const tertiaryGradientStyle = generateGradientStyle(
    tertiaryColor,
    tertiaryColor,
  );

  return (
    <div
      className={cn('fixed inset-0 overflow-hidden', className)}
      aria-hidden='true'
      {...props}
    >
      {/* Main noise overlay */}
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
        {/* Primary gradient */}
        <div
          className={cn('absolute inset-0', primaryGradientClass)}
          style={{
            ...primaryGradientStyle,
            filter: `blur(${primaryBlur}px)`,
          }}
        />

        {/* Secondary gradient */}
        <div
          className={cn('absolute inset-0', secondaryGradientClass)}
          style={{
            ...secondaryGradientStyle,
            filter: `blur(${secondaryBlur}px)`,
          }}
        />

        {/* Tertiary gradient */}
        <div
          className={cn('absolute inset-0', tertiaryGradientClass)}
          style={{
            ...tertiaryGradientStyle,
            filter: `blur(${tertiaryBlur}px)`,
          }}
        />

        {/* Vignette effect */}
        <div
          className='w-full absolute inset-0'
          style={getVignetteSettings()}
        />
      </div>

      {/* Additional gradients for depth */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-zinc-900/10 to-zinc-900/30' />

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      {/* Children content */}
      {children}
    </div>
  );
};

export { NoiseGradientBackground };
