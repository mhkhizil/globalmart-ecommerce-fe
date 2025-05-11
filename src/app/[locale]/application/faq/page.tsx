import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import FAQPageServerWithSuspense from '@/webpages/faq/FAQPageServer';

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.faq',
  });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: t('metadata.keywords'),
  };
}

async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  return <FAQPageServerWithSuspense locale={locale} />;
}

export default FAQPage;
