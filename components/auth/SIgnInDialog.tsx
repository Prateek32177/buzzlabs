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
import { Logo } from '@/components/Logo';

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

      <DialogContent className='max-w-[360px] rounded-xl p-0 overflow-hidden bg-zinc-900 border border-zinc-800'>
        <div className='flex flex-col items-center px-6 pt-8 pb-4 gap-2'>
          <Logo size='xl' />
          <div>
            <DialogTitle className='text-base font-semibold text-white text-center'></DialogTitle>
            <DialogDescription className='text-sm text-zinc-400 text-center'>
              Please sign in to continue.
            </DialogDescription>
          </div>
        </div>

        <div className='px-4'>
          <SignInForm
            searchParams={searchParams}
            isDialog={true}
            onSuccess={handleSuccess}
            showLogo={false}
            showSignUpLink={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
