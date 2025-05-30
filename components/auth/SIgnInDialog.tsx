'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SignInForm } from './SignInForm';
import { type Message } from '@/components/form-message';

interface SignInDialogProps {
  children: React.ReactNode;
  searchParams?: Message;
  onSuccess?: () => void;
}

export function SignInDialog({
  children,
  searchParams,
  onSuccess,
}: SignInDialogProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog key={key} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-[350px] sm:max-w-sm rounded-lg p-3'>
        <DialogTitle className='hidden'>Sign In</DialogTitle>
        <DialogDescription className='hidden'>
          Enter your credentials to access your account.
        </DialogDescription>
        <SignInForm
          searchParams={searchParams}
          isDialog={true}
          onSuccess={handleSuccess}
          showLogo={false}
          showSignUpLink={true}
        />
      </DialogContent>
    </Dialog>
  );
}
