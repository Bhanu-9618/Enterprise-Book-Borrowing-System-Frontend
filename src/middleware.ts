import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;


  const isAuthPage = pathname.startsWith('/auth/');
  if (isAuthPage) {
    if (token && token.trim().length > 0) {
      const redirectUrl = role === 'ADMIN' ? '/staff' : '/users';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }


  const isProtectedAdmin = pathname.startsWith('/staff');
  const isProtectedUser = pathname.startsWith('/users');

  if (isProtectedAdmin || isProtectedUser) {
    if (!token || token.trim().length === 0) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }


    if (isProtectedAdmin && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/users', request.url));
    }
  }

  return NextResponse.next();
}


export const proxy = middleware;
export default middleware;

export const config = {
  matcher: [
    '/staff/:path*',
    '/users/:path*',
    '/auth/:path*',
  ],
};
