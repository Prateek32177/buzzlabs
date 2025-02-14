import HeaderAuth from '@/components/header-auth';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import { Mona_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {/* <nav className='flex h-16 w-full justify-center border-b border-b-foreground/10'>
            <div className='flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm'>
              <div className='flex items-center gap-5 font-semibold'>
                <Link href={'/'}>BuzzLabs</Link>
              </div>
              {<HeaderAuth />}
            </div>
          </nav> */}
          <main className='flex min-h-screen flex-col flex-1 gap-20  items-center '>
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
