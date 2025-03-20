import { ThemeProvider } from 'next-themes';
import './globals.css';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Open_Sans } from 'next/font/google';
// Add your custom font
const openSans = Open_Sans({ subsets: ['latin'] });
const customFont = localFont({
  src: 'fonts/Kollektif.ttf',
});
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

  export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Hookflo',
    description: 'No Code Notification Webhook Infrastructure',
    keywords: ['webhook', 'notifications', 'no-code', 'infrastructure', 'api', 'integration'],
    authors: [{ name: 'Hookflo' }],
    creator: 'Hookflo',
    publisher: 'Hookflo',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://www.hookflo.in/',
      siteName: 'Hookflo',
      title: 'Hookflo - No Code Notification Webhook Infrastructure',
      description: 'No Code Notification Webhook Infrastructure',
      images: [
        {
          url: '/og-image.png', // Make sure to add this image in your public folder
          width: 1200,
          height: 630,
          alt: 'Hookflo - No Code Webhook Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hookflo - No Code Notification Webhook Infrastructure',
      description: 'No Code Notification Webhook Infrastructure',
      images: ['/og-image.png'], // Make sure to add this image in your public folder
      creator: '@Prateek53788134',
      site: '@Prateek53788134',
    },
    alternates: {
      canonical: 'https://www.hookflo.in/',
    }
  };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
      <link rel="canonical" href="https://www.hookflo.in/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          type="image/png"
          href="/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/icon-48x48.png"
        />
        <link rel="manifest" href="/manifest.json" />
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
      </body>
    </html>
  );
}


