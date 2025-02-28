import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function getMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE?.toLowerCase() === 'true';
}

export async function middleware(request: NextRequest) {
  const isMaintenanceMode = getMaintenanceMode();

  if (
    isMaintenanceMode &&
    !request.nextUrl.pathname.startsWith('/maintenance')
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  const supbase = createClient();
  const {
    data: { user },
    error,
  } = await (await supbase).auth.getUser();

  const isAuthenticated = user?.role === 'authenticated';
  const pathToAuthorize = ['/api'];
  const requestPathName = request.nextUrl.pathname;

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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
