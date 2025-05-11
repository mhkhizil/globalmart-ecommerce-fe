// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

import { supportedLocales } from '@/lib/redux/slices/LanguageSlice';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (Next.js provides this)
  const localePromise = await requestLocale;
  let locale = localePromise || 'cn';

  // If no locale is provided in the URL, check the cookie (server-side)
  if (!localePromise && typeof globalThis === 'undefined') {
    const { cookies } = await import('next/headers');
    const response = await cookies();
    const preferredLocale = response.get('preferredLocale')?.value;
    locale =
      preferredLocale && supportedLocales.includes(preferredLocale as any)
        ? preferredLocale
        : 'cn';
  }

  // Ensure the locale is valid
  const validLocale = supportedLocales.includes(locale as any) ? locale : 'cn';

  // Load messages for the locale
  let messages;
  try {
    const response = await import(`./locales/${validLocale}.json`);
    messages = response.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);
    const response = await import('./locales/cn.json');
    messages = response.default;
  }

  return {
    locale: validLocale,
    messages,
  };
});

// Export from the source of truth
export { supportedLocales } from '@/lib/redux/slices/LanguageSlice';
