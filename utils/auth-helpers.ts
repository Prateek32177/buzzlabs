import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();

  if (error || !user) {
    redirect('/sign-in');
  }

  return {
    userId: user?.id,
    userEmail: user?.email,
    user: user,
  };
}
