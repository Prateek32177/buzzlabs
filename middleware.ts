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

  if (isMaintenanceMode && !requestPathName.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

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

  const supbase = createClient();
  const {
    data: { user },
    error,
  } = await (await supbase).auth.getUser();

  const isAuthenticated = user?.role === 'authenticated';
  const pathToAuthorize = ['/api/logs', '/api/usage', '/api/webhooks'];

  const isVerifyWebhookRequest = requestPathName.match(
    /^\/api\/webhooks\/[^/]+\/verify$/,
  );
  const isProtectedPath = pathToAuthorize.some(
    path =>
      requestPathName.startsWith(path) &&
      !(
        (isVerifyWebhookRequest && request.method === 'POST') ||
        (request.headers.get('referer')?.includes('/api/webhooks/') &&
          ['GET', 'POST', 'PATCH'].includes(request.method))
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
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (requestPathName === '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard/webhooks', request.url));
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
