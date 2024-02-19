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

export default async function middleware(req: NextRequest) {
  const session = await getToken({ req });

  const loginUrl = new URL('/login', req.url);
  const homeUrl = new URL('/', req.url);
  const path = req.nextUrl.pathname;

  /**
   * Unauthenticated users
   */
  if (!session) {
    // Allow unauthenticated user to access "/"
    if (path === '/' || path === '/about' || path === '/login' || path === 'example') {
      return NextResponse.next();
    }
  }

  /**
   * Authenticated users
   */
  if (session) {
    // @ts-ignore
    const baseUrlPath = getBaseUrlPath(session?.user.role);

    // Redirect to dashboard if authenticated and on login page
    if (path === '/login' || path === '/') {
      const dashboardUrl = new URL(`${baseUrlPath}/dashboard`, req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}
