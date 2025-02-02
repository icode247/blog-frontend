// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (request.nextUrl.pathname.startsWith('/blog') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Specify which routes should be protected
export const config = {
  matcher: ['/blog/:path*', '/subscription/:path*'],
};