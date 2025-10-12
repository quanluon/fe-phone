import { NextRequest, NextResponse } from 'next/server';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

export function middleware(request: NextRequest) {
  // Get locale from query parameter, cookie, or use default
  const localeFromQuery = request.nextUrl.searchParams.get('locale');
  const localeFromCookie = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Determine the locale to use
  let locale = defaultLocale;
  
  if (localeFromQuery && locales.includes(localeFromQuery)) {
    locale = localeFromQuery;
  } else if (localeFromCookie && locales.includes(localeFromCookie)) {
    locale = localeFromCookie;
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Set locale in cookie for persistence
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
  
  // Set locale in header for next-intl to read
  response.headers.set('x-locale', locale);
  
  return response;
}

export const config = {
  // Match all paths except static files and api routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

