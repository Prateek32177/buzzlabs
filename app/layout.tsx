import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Mona_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

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
          <main className=' min-h-screen'>
            <div className=' p-5'>{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
