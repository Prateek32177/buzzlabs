'use server';

import { createClient } from '@/utils/supabase/server';

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth error:', error.message);
      return {
        isAuthenticated: false,
        userEmail: null,
        userId: null,
        error: error.message,
      };
    }

    return {
      isAuthenticated: !!user,
      userEmail: user?.email ?? null,
      userId: user?.id ?? null,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      isAuthenticated: false,
      userEmail: null,
      userId: null,
      error: 'An unexpected error occurred',
    };
  }
}
