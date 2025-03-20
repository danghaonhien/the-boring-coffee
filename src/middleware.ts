import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and trying to access admin routes, redirect to auth page
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    const redirectUrl = new URL('/auth', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If we have a session but trying to access admin routes, check if user is admin
  if (session && request.nextUrl.pathname.startsWith('/admin')) {
    // Get user role from public.users table
    const { data: userData, error } = await supabase
      .from('users')  // Using public.users table
      .select('role')
      .eq('id', session.user.id)
      .single();

    // If error or not admin, redirect to auth page with error message
    if (error || !userData || userData.role !== 'admin') {
      const redirectUrl = new URL('/auth', request.url);
      // Add an error parameter to show appropriate message
      redirectUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If on the auth page but already authenticated as admin, redirect to admin dashboard
  if (session && request.nextUrl.pathname === '/auth') {
    // Get user role from public.users table
    const { data: userData, error } = await supabase
      .from('users')  // Using public.users table
      .select('role')
      .eq('id', session.user.id)
      .single();

    // If admin, redirect to admin dashboard
    if (!error && userData && userData.role === 'admin') {
      const redirectUrl = new URL('/admin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/auth', '/auth/callback'],
}; 