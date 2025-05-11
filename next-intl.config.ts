import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Load messages for the requested locale
  let messages;
  try {
    messages = (await import(`./src/i18n/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to Chinese
    messages = (await import('./src/i18n/locales/cn.json')).default;
  }

  return {
    messages,
  };
});
