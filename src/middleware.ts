import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NEXT.JS 16 PROXY/MIDDLEWARE
 * This function handles server-side route protection.
 * We export it as both 'middleware' and 'proxy' (default) to satisfy 
 * the transition in Next.js 16.2.1.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // 1. PUBLIC ROUTES (Guests only) - Redirect away IF token exists and is valid
  const isAuthPage = pathname.startsWith('/auth/');
  if (isAuthPage) {
    if (token && token.trim().length > 0) {
      const redirectUrl = role === 'ADMIN' ? '/staff' : '/users';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTES - Redirect to signin if NO token
  const isProtectedAdmin = pathname.startsWith('/staff');
  const isProtectedUser = pathname.startsWith('/users');

  if (isProtectedAdmin || isProtectedUser) {
    if (!token || token.trim().length === 0) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Role-based filtering for admin routes
    if (isProtectedAdmin && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/users', request.url));
    }
  }

  return NextResponse.next();
}

// Aliasing for Next.js 16 Proxy convention
export const proxy = middleware;
export default middleware;

export const config = {
  matcher: [
    '/staff/:path*',
    '/users/:path*',
    '/auth/:path*',
  ],
};
