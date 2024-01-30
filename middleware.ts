import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
  const dashboardUrl = new URL('/dashboard', req.url);
  const homeUrl = new URL('/', req.url);
  const path = req.nextUrl.pathname;

  // Allow unauthenticated user to access "/"
  if (!session && path === '/') {
    return NextResponse.next();
  }

  // Allow unauthenticated user to access "/example"
  if (!session && path === '/example') {
    return NextResponse.next();
  }

  // Allow unauthenticated user to access "/about"
  if (!session && path === '/about') {
    return NextResponse.next();
  }

  // Redirect to dashboard if authenticated and on login page
  if (session && path == '/login') {
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect to dashboard if authenticated and on home page
  if (session && path == '/') {
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}
