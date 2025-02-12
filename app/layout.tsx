import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={geistSans.className} suppressHydrationWarning>
      <body className='bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <main className='flex min-h-screen flex-col items-center'>
            <div className='flex w-full flex-1 flex-col items-center gap-20'>
              <nav className='flex h-16 w-full justify-center border-b border-b-foreground/10'>
                <div className='flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm'>
                  <div className='flex items-center gap-5 font-semibold'>
                    <Link href={'/'}>Next.js Supabase Starter</Link>
                  </div>
                  {<HeaderAuth />}
                </div>
              </nav>
              <div className='flex max-w-5xl flex-col gap-20 p-5'>
                {children}
              </div>

              <footer className='mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs'>
                <p>
                  Powered by{' '}
                  <a
                    href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
                    target='_blank'
                    className='font-bold hover:underline'
                    rel='noreferrer'
                  >
                    Supabase
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
