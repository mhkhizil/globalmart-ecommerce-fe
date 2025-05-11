import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantOrderItemDetailPageServerWithSuspense from '@/webpages/merchant-orderitem-detail/MerchantOrderItemDetailPageServer';

interface IPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.merchant_orderitem_detail.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantOrderItemDetailPage(props: IPageProps) {
  const { id } = await props.params;

  return <MerchantOrderItemDetailPageServerWithSuspense id={id} />;
}

export default MerchantOrderItemDetailPage;
