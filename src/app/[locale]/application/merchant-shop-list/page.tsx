import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantShopListPageServerWithSuspense from '@/webpages/merchant-shop-list/MerchantShopListPageServer';

interface MerchantShopListPageProps {
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
    namespace: 'application.merchant_shop_list.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantShopListPage({ params }: MerchantShopListPageProps) {
  return <MerchantShopListPageServerWithSuspense />;
}

export default MerchantShopListPage;
