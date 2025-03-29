import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function getMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE?.toLowerCase() === 'true';
}

function getWaitlistMode(): boolean {
  return process.env.WAITLIST_MODE?.toLowerCase() === 'true';
}

export async function middleware(request: NextRequest) {
  const isMaintenanceMode = getMaintenanceMode();
  const isWaitlistMode = getWaitlistMode();
  const requestPathName = request.nextUrl.pathname;

  // Maintenance mode check
  if (isMaintenanceMode && !requestPathName.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Waitlist mode check
  if (isWaitlistMode) {
    const allowedPaths = [
      '/',
      '/api/waitlist',
      '/api/verify-email',
      '/verification-success',
      '/verification-failed',
    ];
    if (!allowedPaths.some(path => requestPathName === path)) {
      return NextResponse.rewrite(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // Rest of your existing authentication logic
  const supbase = createClient();
  const {
    data: { user },
    error,
  } = await (await supbase).auth.getUser();

  const isAuthenticated = user?.role === 'authenticated';
  const pathToAuthorize = ['/api/webhooks'];

  const isProtectedPath = pathToAuthorize.some(
    path =>
      requestPathName.startsWith(path) &&
      !(
        requestPathName.startsWith('/api/webhooks') && request.method === 'POST'
      ),
  );

  if (isProtectedPath) {
    if (!isAuthenticated) {
      return NextResponse.rewrite(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }
  if (requestPathName.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  if (
    isAuthenticated &&
    ['/sign-in', '/sign-up', '/forgot-password'].includes(
      request.nextUrl.pathname,
    )
  ) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)',
  ],
};
