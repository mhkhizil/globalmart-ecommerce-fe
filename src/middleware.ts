// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { supportedLocales } from './lib/redux/slices/LanguageSlice';

// Create the middleware with CN as default
const intlMiddleware = createMiddleware({
  locales: supportedLocales,
  defaultLocale: 'cn',
  localeDetection: false, // Disable automatic detection to use our custom logic
});

// Set cookie expiry for 1 year
const COOKIE_MAX_AGE = 31_536_000;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get the preferred locale from the cookie
  const preferredLocale = request.cookies.get('preferredLocale')?.value;
  const validLocale =
    preferredLocale && supportedLocales.includes(preferredLocale as any)
      ? preferredLocale
      : 'cn'; // Fallback to 'cn' if cookie is invalid or missing

  // Extract current locale from URL if present
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in path, redirect to add locale
  if (!pathnameHasLocale) {
    // Clone the request URL and set the locale
    const url = request.nextUrl.clone();
    url.pathname = `/${validLocale}${pathname}`;
    const response = NextResponse.redirect(url);

    // Set the cookie with the preferred locale
    response.cookies.set('preferredLocale', validLocale, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Must be false for client access
    });

    return response;
  }

  // Get current locale from URL
  const currentLocale = pathname.split('/')[1];

  // Create basic response with next-intl middleware
  const response = intlMiddleware(request);

  // Always set cookie to match the URL locale
  if (supportedLocales.includes(currentLocale as any)) {
    // Set new cookie value to match the URL locale
    response.cookies.set('preferredLocale', currentLocale, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Must be false for client access
    });

    // Disable caching to ensure fresh responses
    response.headers.set(
      'Cache-Control',
      'no-store, must-revalidate, max-age=0'
    );
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
