import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomSlackChannelName(): string {
  const channelNames = [
    'Sunbeam',
    'Driftwood',
    'Breezy',
    'Glowup',
    'Petal',
    'Daylight',
    'Lilt',
    'Peachy',
    'Wanderly',
    'Blossom',
    'Loftie',
    'Kindle',
    'Melloway',
    'Cloudlet',
    'Snug',
    'Golden',
    'Hushlet',
    'Crispa',
    'Velveton',
    'Serenish',
  ];

  const randomIndex = Math.floor(Math.random() * channelNames.length);
  return channelNames[randomIndex];
}

// lib/utils.ts

/**
 * Format bytes to human-readable format
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 * @returns Formatted string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format date to MMM D format (e.g., Apr 15)
 * @param dateString Date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate percentage
 * @param value Current value
 * @param max Maximum value
 * @returns Percentage
 */
export function calculatePercentage(value: number, max: number): number {
  if (max === 0) return 0;
  return (value / max) * 100;
}
