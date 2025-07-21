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
  const requestPathName = request.nextUrl.pathname;

  const isMaintenanceMode = getMaintenanceMode();
  const isWaitlistMode = getWaitlistMode();

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
      '/maintenance',
    ];

    if (
      allowedPaths.includes(requestPathName) ||
      requestPathName.startsWith('/_next/') ||
      requestPathName.match(/\.(css|js|ico)$/)
    ) {
      return NextResponse.next();
    }

    return NextResponse.rewrite(new URL('/unauthorized', request.url));
  }

  // Allow external webhook endpoints to bypass authentication
  const externalWebhookPaths = ['/api/webhooks/clerk'];

  if (externalWebhookPaths.some(path => requestPathName.startsWith(path))) {
    return NextResponse.next();
  }

  const protectedRoutes = {
    '/api/logs': {
      allowedMethods: ['GET', 'POST'],
      allowInternalCalls: true,
    },
    '/api/usage': {
      allowedMethods: ['GET'],
      allowInternalCalls: true,
    },
    '/api/webhooks': {
      allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowInternalCalls: false,
    },
  };

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();
  const isAuthenticated = !!user;

  const isWebhookVerifyRequest =
    requestPathName.match(/^\/api\/webhooks\/[^/]+\/verify$/) &&
    request.method === 'POST';

  if (isWebhookVerifyRequest) {
    return NextResponse.next();
  }

  const matchedProtectedRoute = Object.entries(protectedRoutes).find(
    ([route]) =>
      requestPathName === route || requestPathName.startsWith(`${route}/`),
  );

  if (matchedProtectedRoute) {
    const [path, config] = matchedProtectedRoute;

    if (!config.allowedMethods.includes(request.method)) {
      return new NextResponse(null, { status: 405 });
    }

    const internalCallSignature = request.headers.get(
      'x-webhook-internal-call',
    );
    const isInternalWebhookCall =
      internalCallSignature === process.env.INTERNAL_WEBHOOK_SECRET;

    if (isInternalWebhookCall && config.allowInternalCalls) {
      return NextResponse.next();
    }

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
    ['/sign-in', '/sign-up', '/forgot-password'].includes(requestPathName)
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
