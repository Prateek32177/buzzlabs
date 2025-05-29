import { type Message } from '@/components/form-message';
import { SignInForm } from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Hookflo',
  description: 'Sign in to your Hookflo account',
};

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <SignInForm
      searchParams={searchParams}
      isDialog={false}
      showLogo={true}
      showSignUpLink={true}
    />
  );
}
