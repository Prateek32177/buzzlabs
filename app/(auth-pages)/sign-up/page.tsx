import { signUpAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Logo } from '@/components/Logo';

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ('message' in searchParams) {
    return (
      <div className='flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md'>
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className='flex min-w-64 flex-1 flex-col'>
        <Card className='relative w-[350px] overflow-hidden'>
          <CardHeader>
            <div className='m-auto mb-6'>
              <Logo size='2xl' />
            </div>
            <CardTitle className='text-xl'>Sign Up</CardTitle>
            <CardDescription>
              Enter your credentials to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col gap-2 [&>input]:mb-3'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  name='username'
                  placeholder='Enter your username'
                  required
                />
                <Label htmlFor='email'>Email</Label>
                <Input name='email' placeholder='you@example.com' required />
                <Label htmlFor='password'>Password</Label>
                <Input
                  type='password'
                  name='password'
                  placeholder='Your password'
                  minLength={6}
                  required
                />

                <FormMessage message={searchParams} />
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button asChild variant={'outline'}>
              <Link href='/sign-in'>Sign in</Link>
            </Button>
            <SubmitButton formAction={signUpAction} pendingText='Signing up...'>
              Sign up
            </SubmitButton>
          </CardFooter>
          <BorderBeam duration={8} size={100} />
        </Card>
      </form>
    </>
  );
}
