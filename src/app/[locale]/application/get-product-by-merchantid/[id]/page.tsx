import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantProductsClient from './MerchantProductsClient';

interface PageParams {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.get_product_by_merchantid.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function GetProductByMerchantId(params: PageParams) {
  const { id } = await params.params;
  return <MerchantProductsPage id={id} />;
}
export default GetProductByMerchantId;

function MerchantProductsPage({ id }: { id: string }) {
  return (
    <main className="w-full h-full">
      <Suspense fallback={<FallBackLoading />}>
        <MerchantProductsClient merchantId={id} />
      </Suspense>
    </main>
  );
}
