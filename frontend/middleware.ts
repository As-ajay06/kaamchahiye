import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - allow access
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return NextResponse.next();
  }

  // Protected routes are handled client-side in the pages
  // This middleware just allows the request through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

