import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We check for auth token in cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // The dashboard is at '/'
  // Login is at '/login'
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname.startsWith('/reset-password') || pathname.startsWith('/verify-otp');
  // Exclude static paths and auth paths to determine if it's a protected route
  const isProtectedRoute = !isAuthRoute && !pathname.startsWith('/api') && !pathname.startsWith('/_next');

  if (isProtectedRoute && !token) {
    // Redirect to login if accessing protected route without a token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    // Redirect to root (dashboard) if trying to access login while already authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
