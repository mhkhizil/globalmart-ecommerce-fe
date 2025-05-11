// src/lib/utils/cookies.ts
import Cookies from 'js-cookie';

// Safely check if we're in a browser
const isBrowser =
  typeof globalThis !== 'undefined' && typeof document !== 'undefined';

export function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
    domain?: string;
  } = {}
) {
  if (!isBrowser) return; // Avoid running on server-side

  const {
    path = '/',
    maxAge,
    sameSite = 'Lax',
    secure = isBrowser ? globalThis.location.protocol === 'https:' : true, // Secure by default in production
    domain,
  } = options;

  // Convert maxAge to expires (js-cookie uses expires instead of maxAge)
  const cookieOptions: Cookies.CookieAttributes = {
    path,
    sameSite: sameSite.toLowerCase() as 'lax' | 'strict' | 'none',
    secure,
    domain,
  };

  if (maxAge !== undefined) {
    cookieOptions.expires = maxAge / 86_400; // Convert seconds to days
  }

  try {
    Cookies.set(name, value, cookieOptions);

    // For debugging - helps track cookie writes in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cookie set: ${name}=${value}`, cookieOptions);
    }
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

export function getCookie(name: string): string | undefined {
  if (!isBrowser) return undefined;

  try {
    const value = Cookies.get(name);

    // For debugging - helps track cookie reads in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cookie get: ${name}=${value}`);
    }

    return value;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return undefined;
  }
}

export function deleteCookie(
  name: string,
  options: { path?: string; domain?: string } = {}
) {
  if (!isBrowser) return;

  try {
    Cookies.remove(name, options);

    // For debugging - helps track cookie deletion in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cookie deleted: ${name}`, options);
    }
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
}
