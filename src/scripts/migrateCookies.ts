import { Locale, supportedLocales } from '@/lib/redux/slices/LanguageSlice';
import { getCookie, setCookie } from '@/lib/util/cookies';

/**
 * This script helps migrate cookies when changing the default locale
 * It should run once on client-side to ensure smooth transition
 */
export function migrateCookies() {
  if (typeof globalThis === 'undefined') {
    return; // Only run on client side
  }

  try {
    // First check if there's a locale in the URL that should be respected
    let urlLocale: Locale | undefined;

    const pathParts = globalThis.location.pathname.split('/');
    if (pathParts.length > 1) {
      const firstSegment = pathParts[1];
      if (supportedLocales.includes(firstSegment as Locale)) {
        urlLocale = firstSegment as Locale;
      }
    }

    // Get current cookie value
    const cookieLocale = getCookie('preferredLocale') as Locale | undefined;

    // Determine which locale to use
    // Priority: URL locale > cookie > default
    const localeToUse =
      urlLocale && supportedLocales.includes(urlLocale)
        ? urlLocale
        : cookieLocale && supportedLocales.includes(cookieLocale)
          ? cookieLocale
          : 'cn'; // Default fallback

    // Set the cookie with the determined locale
    setCookie('preferredLocale', localeToUse, {
      path: '/',
      maxAge: 31_536_000, // 1-year expiry
      sameSite: 'Lax',
      secure: globalThis.location.protocol === 'https:',
    });

    //console.log(`Cookie set to ${localeToUse}`);
  } catch (error) {
    console.error('Error setting locale cookie:', error);

    // Fallback to default locale
    try {
      setCookie('preferredLocale', 'cn', {
        path: '/',
        maxAge: 31_536_000,
        sameSite: 'Lax',
        secure: globalThis.location.protocol === 'https:',
      });
    } catch (fallbackError) {
      console.error('Final cookie setting attempt failed', fallbackError);
    }
  }
}

export default migrateCookies;
