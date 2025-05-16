import { forgotPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Logo } from '@/components/Logo';
export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className='flex min-w-64 flex-1 flex-col'>
        <Card className='relative w-[400px] overflow-hidden'>
          <CardHeader>
            <div className='m-auto mb-6'>
              <Logo size='2xl' />
            </div>
            <CardTitle className='text-xl'>Forgot Password</CardTitle>
            <CardDescription>
              Already have an account?{' '}
              <Link className='text-primary underline' href='/sign-in'>
                Sign in
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2 [&>input]:mb-3'>
            <Label htmlFor='email'>Email</Label>
            <Input
              name='email'
              placeholder='you@example.com'
              required
              className='placeholder:text-sm'
            />
            <SubmitButton formAction={forgotPasswordAction}>
              Reset Password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </CardContent>
        </Card>
      </form>
    </>
  );
}
