import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantOrderListPageServerWithSuspense from '@/webpages/merchant-order-list/MerchantOrderListPageServer';

interface IPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    categoryId: number;
    status: number;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.merchant_order_list.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantOrderListPage(props: IPageProps) {
  const { categoryId, status } = await props.searchParams;
  return (
    <MerchantOrderListPageServerWithSuspense
      categoryId={categoryId}
      status={status}
    />
  );
}

export default MerchantOrderListPage;
