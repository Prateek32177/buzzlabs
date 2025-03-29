import { ThemeProvider } from 'next-themes';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Open_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const openSans = Open_Sans({ subsets: ['latin'] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Hookflo',
  description: 'No Code Notification Webhook Infrastructure',
  keywords: [
    'webhook',
    'notifications',
    'no-code',
    'infrastructure',
    'api',
    'integration',
  ],
  authors: [{ name: 'Hookflo' }],
  creator: 'Hookflo',
  publisher: 'Hookflo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.hookflo.com/',
    siteName: 'Hookflo',
    title: 'Hookflo - Quick to setup alerting system for web apps',
    description: 'No Code Notification Webhook Infrastructure',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hookflo - No Code Webhook Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hookflo - Quick to setup alerting system for web apps',
    description: 'No Code Notification Webhook Infrastructure',
    images: ['/og-image.png'],
    creator: '@Prateek53788134',
    site: '@Prateek53788134',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Boldonse&display=swap'
          rel='stylesheet'
        />

        <link
          rel='apple-touch-icon'
          sizes='192x192'
          type='image/png'
          href='/icon-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='96x96'
          href='/icon-96x96.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='48x48'
          href='/icon-48x48.png'
        />
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background antialiased dark',
          openSans.className,
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <main className='flex min-h-screen flex-col flex-1 gap-20  items-center '>
            {children}
          </main>
          <Toaster richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
