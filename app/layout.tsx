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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
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
