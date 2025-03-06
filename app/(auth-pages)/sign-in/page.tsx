import { signInAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { BorderBeam } from '@/components/magicui/border-beam';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className='flex min-w-64 flex-1 flex-col'>
      <Card className='relative w-[350px] overflow-hidden'>
        <CardHeader>
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
        <BorderBeam duration={8} size={100} />
      </Card>
    </form>
  );
}
