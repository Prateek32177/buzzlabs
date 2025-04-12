import {
  signInAction,
  signInWithGoogleAction,
  signInWithGithubAction,
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
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Hookflo',
  description: 'Sign in to your Hookflo account',
};

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className='flex min-w-64 flex-1 flex-col'>
      <Card className='relative w-[400px] overflow-hidden'>
        <CardHeader>
          <div className='m-auto mb-6'>
            <Logo size='2xl' />
          </div>
          <CardTitle className='text-xl'>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col gap-2 [&>input]:mb-3'>
              <Label htmlFor='email'>Email</Label>
              <Input name='email' placeholder='you@example.com' required />
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  className='text-xs text-foreground underline'
                  href='/forgot-password'
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type='password'
                name='password'
                placeholder='Your password'
                required
              />

              <FormMessage message={searchParams} />
            </div>

            <div className='relative mb-2'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-card px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Button
                variant='outline'
                type='button'
                className='w-full flex items-center gap-2 transition-all  '
                onClick={signInWithGithubAction}
              >
                <Github className='h-4 w-4' />
                <span>GitHub</span>
              </Button>

              {/* <Button
                variant='outline'
                type='button'
                className='w-full flex items-center gap-2 transition-all  '
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
                <span>Google</span>
              </Button> */}
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' asChild>
            <Link href='/sign-up'>Sign up</Link>
          </Button>
          <SubmitButton
            className='group'
            pendingText='Signing In...'
            formAction={signInAction}
          >
            Sign in
            <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
