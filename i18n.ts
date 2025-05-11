import { supportedLocales } from '@/i18n/request';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  if (!supportedLocales.includes(locale as any)) {
    notFound();
  }
  return {
    locale,
    messages: (await import(`./src/i18n/locales/${locale}.json`)).default,
  };
});
