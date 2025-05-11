import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantProductCreatePageServerWithSuspense from '@/webpages/merchant-product-create/MerchantProductCreatePageServer';

interface MerchantProductCreatePageProps {
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
    namespace: 'application.merchant_product_create.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function MerchantProductCreatePage({ params }: MerchantProductCreatePageProps) {
  return <MerchantProductCreatePageServerWithSuspense />;
}

export default MerchantProductCreatePage;
