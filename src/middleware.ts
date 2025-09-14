import { NextRequest, NextResponse } from 'next/server';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

export function middleware(request: NextRequest) {
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

