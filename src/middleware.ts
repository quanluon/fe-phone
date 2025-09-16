import { NextRequest, NextResponse } from 'next/server';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

// Protected routes that require authentication
const protectedRoutes = ['/profile', '/orders', '/wishlist'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Check for access token in cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    
    // Debug logging
    console.log('🔍 Middleware Debug:', {
      pathname,
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      cookieCount: request.cookies.getAll().length
    });
    
    // Check if access token exists and is not empty
    if (!accessToken || accessToken.trim() === '') {
      // Redirect to login if no token
      const loginUrl = new URL('/auth?mode=login', request.url);
      console.log('❌ Redirecting to login - no access token or empty token');
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('✅ Access token found, proceeding');
  }
  
  // Get the locale from query parameter
  const locale = request.nextUrl.searchParams.get('locale');
  
  // Validate locale and set default if invalid
  const validLocale = locale && locales.includes(locale) ? locale : defaultLocale;
  
  // Set the locale in the request headers for next-intl
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', validLocale);
  
  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Set locale cookie
  response.cookies.set('NEXT_LOCALE', validLocale, {
    path: '/',
    sameSite: 'lax',
  });
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - all root files inside /public (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_static|.*\\..*).*)']
};

