import { signInAction, signInWithGithubAction } from '@/app/actions';
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

        <CardContent className='space-y-6'>
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

        <CardFooter className='flex justify-between pt-4 space-x-3'>
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
