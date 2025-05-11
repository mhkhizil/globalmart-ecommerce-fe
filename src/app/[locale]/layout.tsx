import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import ClientLocaleWrapper from '@/components/common/LanguageProvider/ClientLocaleWrapper';
import CookieMigration from '@/components/common/LanguageProvider/CookieMigration';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Get the locale from the URL parameter
  const { locale } = await params;

  // Get messages for this locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientLocaleWrapper locale={locale}>
        <CookieMigration />
        <main lang={locale}>{children}</main>
      </ClientLocaleWrapper>
    </NextIntlClientProvider>
  );
}
