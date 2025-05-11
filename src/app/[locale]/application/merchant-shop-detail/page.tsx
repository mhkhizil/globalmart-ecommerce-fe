import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantProfilePageServerWithSuspense from '@/webpages/merchant-profile/MerchantProfilePageServer';

interface MerchantProfilePageProps {
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
    namespace: 'application.merchant_shop_detail.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantProfilePage({ params }: MerchantProfilePageProps) {
  return <MerchantProfilePageServerWithSuspense />;
}

export default MerchantProfilePage;
