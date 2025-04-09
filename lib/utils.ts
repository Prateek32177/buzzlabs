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
