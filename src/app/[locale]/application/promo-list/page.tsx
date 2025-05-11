import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PromoListPageServerWithSuspense from '@/webpages/promo-list/PromoListPageServer';

interface PromoListPageProps {
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
    namespace: 'application.PromoList.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function PromoListPage({ params }: PromoListPageProps) {
  return <PromoListPageServerWithSuspense />;
}

export default PromoListPage;
