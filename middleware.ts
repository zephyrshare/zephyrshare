import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getBaseUrlPath } from '@/lib/user-roles-privileges';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

// The middleware function is called for each request
// https://nextjs.org/docs/app/building-your-application/routing/middleware
export default async function middleware(req: NextRequest) {
  const session = await getToken({ req });
  const path = req.nextUrl.pathname;

  // Define paths that are allowed for unauthenticated access
  const publicPaths = ['/', '/about', '/login'];

  /**
   * Unauthenticated users handling:
   * Redirect to the login page if accessing restricted routes
   */
  if (!session && !publicPaths.includes(path)) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Authenticated users handling:
   * Redirect from login or root page to a role-based page
   */
  if (session) {
    // @ts-ignore: Assume getBaseUrlPath handles the role and returns the correct base URL
    const baseUrlPath = getBaseUrlPath(session.user.role);

    // Handle routes that do not have a base URL path:
    if (path === '/account') {
      return NextResponse.next();
    }

    // If the existing path doesn't start with the base URL path OR an authenticated user is on /login, redirect to the "/marketdata" route
    if (!path.startsWith(baseUrlPath) || path === '/login') {
      const marketDataUrl = new URL(`${baseUrlPath}/marketdata`, req.url);
      return NextResponse.redirect(marketDataUrl);
    }
  }

  return NextResponse.next();
}
