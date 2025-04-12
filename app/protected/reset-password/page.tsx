import { resetPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className='flex min-w-64 flex-1 flex-col'>
      <Card className='relative w-[400px] overflow-hidden m-auto'>
        <CardHeader>
          <div className='m-auto mb-6'>
            <Logo size='2xl' />
          </div>
          <CardTitle className='text-xl'>Reset Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2 [&>input]:mb-3'>
          <Label htmlFor='password'>New password</Label>
          <Input
            type='password'
            name='password'
            placeholder='New password'
            required
          />
          <Label htmlFor='confirmPassword'>Confirm password</Label>
          <Input
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            required
          />
          <SubmitButton formAction={resetPasswordAction}>
            Reset password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </CardContent>
      </Card>
    </form>
  );
}
