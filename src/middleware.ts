import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Temporarily disable middleware for debugging
  console.log('Middleware: Request to', request.nextUrl.pathname);
  return NextResponse.next();

  /* Temporarily disabled for debugging login redirect
  const token = request.cookies.get('token')?.value;
  console.log('Middleware: Token found:', !!token);

  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware: Checking admin access');
    if (!token) {
      console.log('Middleware: No token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.log('Middleware: JWT_SECRET not configured');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      const decoded = jwt.verify(token, secret!) as any;
      console.log('Middleware: Token decoded, role:', decoded.role);
      if (decoded.role !== 'admin') {
        console.log('Middleware: Not admin, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }
      console.log('Middleware: Admin access granted');
    } catch (error) {
      console.log('Middleware: Token verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: ['/admin/:path*'],
};