import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

function getMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE?.toLowerCase() === 'true';
}

function getWaitlistMode(): boolean {
  return process.env.WAITLIST_MODE?.toLowerCase() === 'true';
}

// Define route matchers for different scenarios
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const requestPathName = request.nextUrl.pathname;

  const isMaintenanceMode = getMaintenanceMode();
  const isWaitlistMode = getWaitlistMode();

  // Maintenance mode check - highest priority
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

  // Get auth information from Clerk
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  // Protected API routes configuration
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

  // Special case: webhook verification endpoint (always public)
  const isWebhookVerifyRequest =
    requestPathName.match(/^\/api\/webhooks\/[^/]+\/verify$/) &&
    request.method === 'POST';

  if (isWebhookVerifyRequest) {
    return NextResponse.next();
  }

  // Check protected API routes
  const matchedProtectedRoute = Object.entries(protectedRoutes).find(
    ([route]) =>
      requestPathName === route || requestPathName.startsWith(`${route}/`),
  );

  if (matchedProtectedRoute) {
    const [path, config] = matchedProtectedRoute;

    // Check if HTTP method is allowed
    if (!config.allowedMethods.includes(request.method)) {
      return new NextResponse(null, { status: 405 });
    }

    // Check for internal webhook calls
    const internalCallSignature = request.headers.get(
      'x-webhook-internal-call',
    );
    const isInternalWebhookCall =
      internalCallSignature === process.env.INTERNAL_WEBHOOK_SECRET;

    if (isInternalWebhookCall && config.allowInternalCalls) {
      return NextResponse.next();
    }

    // Require authentication for protected API routes
    if (!isAuthenticated) {
      return NextResponse.rewrite(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // Dashboard route protection
  if (isDashboardRoute(request)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect /dashboard to /dashboard/webhooks
    if (requestPathName === '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard/webhooks', request.url));
    }

    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute(request)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Default: allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
