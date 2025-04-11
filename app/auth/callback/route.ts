import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo =
    searchParams.get('redirect_to')?.toString() || '/dashboard/webhooks';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.message)}`,
      );
    }

    // Successful authentication
    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';
    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${redirectTo}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${redirectTo}`);
    } else {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // No code present, return to sign-in page
  console.log('No auth code found, redirecting to sign-in');
  return NextResponse.redirect(`${origin}/sign-in`);
}
