import {
  signInAction,
  signInWithGithubAction,
  signInWithGoogleAction,
} from '@/app/actions';
import { FormMessage, type Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';

interface SignInFormProps {
  searchParams?: Message;
  isDialog?: boolean;
  onSuccess?: () => void;
  showLogo?: boolean;
  showSignUpLink?: boolean;
}

export function SignInForm({
  searchParams,
  isDialog = false,
  onSuccess,
  showLogo = true,
  showSignUpLink = true,
}: SignInFormProps) {
  return (
    <form className={isDialog ? 'w-full' : 'flex min-w-64 flex-1 flex-col'}>
      <Card
        className={`relative overflow-hidden rounded-2xl bg-zinc-900/80 backdrop-blur ${
          isDialog ? 'border-0 shadow-none' : 'w-[350px] shadow-xl'
        }`}
      >
        {!isDialog && (
          <CardHeader className='flex flex-col items-center text-center'>
            {showLogo && (
              <div className='mb-1'>
                <Logo size='2xl' />
              </div>
            )}
            <CardTitle className='text-base font-semibold tracking-tight'>
              Sign in to your account
            </CardTitle>
            <CardDescription className='text-sm text-zinc-400'>
              Access your dashboard securely.
            </CardDescription>
          </CardHeader>
        )}

        <CardContent className='space-y-6 pb-0'>
          <Button
            variant='outline'
            type='button'
            className='w-full flex items-center justify-center gap-3 py-4 bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/70 transition rounded-xl text-sm font-medium shadow-sm'
            onClick={signInWithGoogleAction}
          >
            <svg className='h-4 w-4' viewBox='0 0 24 24'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
              <path d='M1 1h22v22H1z' fill='none' />
            </svg>
            Google
          </Button>
          <Button
            variant='outline'
            type='button'
            className='w-full flex items-center justify-center gap-3 py-4 bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-700/70 transition rounded-xl text-sm font-medium shadow-sm'
            onClick={signInWithGithubAction}
          >
            <Github className='h-4 w-4' />
            Continue with GitHub
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator className='w-full bg-zinc-700' />
            </div>
            <div className='relative flex justify-center text-[11px] uppercase tracking-wider'>
              <span className='bg-zinc-900 px-2 text-zinc-500'>
                or continue with
              </span>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <div className='flex flex-col space-y-1'>
              <Label htmlFor='email' className='text-xs text-zinc-400 '>
                Email
              </Label>
              <Input
                name='email'
                placeholder='you@example.com'
                required
                className='rounded-xl bg-zinc-800 border border-zinc-700 focus:border-[#7B6FF1] focus:ring-1 focus:ring-[#7B6FF1] text-sm placeholder:text-zinc-500 transition'
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-xs text-zinc-400'>
                  Password
                </Label>
                <Link
                  href='/forgot-password'
                  className='text-xs font-medium text-[#9E8DF7] hover:text-[#7B6FF1]'
                >
                  Forgot?
                </Link>
              </div>
              <Input
                type='password'
                name='password'
                placeholder='Your password'
                required
                className='rounded-xl bg-zinc-800 border border-zinc-700 focus:border-[#7B6FF1] focus:ring-1 focus:ring-[#7B6FF1] text-sm placeholder:text-zinc-500 transition'
              />
            </div>

            {searchParams && <FormMessage message={searchParams} />}
          </div>
        </CardContent>

        <CardFooter
          className={`flex justify-between space-x-3   ${isDialog ? 'pt-4' : 'pt-2'}`}
        >
          {showSignUpLink && (
            <Button variant='outline' asChild>
              <Link href='/sign-up'>Sign up</Link>
            </Button>
          )}
          <SubmitButton
            className='rounded-xl bg-gradient-to-r from-[#9E8DF7] to-[#7B6FF1] text-white font-medium py-2 shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-100 transition-transform'
            pendingText='Signing in...'
            formAction={signInAction}
            aria-label='Sign in to your account'
          >
            Sign in
            <ArrowRight className='ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform' />
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
