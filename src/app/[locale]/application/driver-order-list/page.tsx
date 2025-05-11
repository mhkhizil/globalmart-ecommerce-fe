import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import DriverOrderListPageServerWithSuspense from '@/webpages/driver-orderlist/DriverOrderListPageServer';

interface DriverOrderListPageProps {
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
    namespace: 'application.driver_order_list.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function DriverOrderListPage({ params }: DriverOrderListPageProps) {
  return <DriverOrderListPageServerWithSuspense />;
}

export default DriverOrderListPage;
