import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='flex w-full flex-1 flex-col gap-12'>
      <div className='w-full'>
        <div className='flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground'>
          <InfoIcon size='16' strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
    </div>
  );
}
