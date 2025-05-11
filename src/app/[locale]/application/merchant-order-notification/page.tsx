import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantOrderNotificationPageServerWithSuspense from '@/webpages/merchant-order-notification/MerchantOrderNotificationPageServer';

interface MerchantOrderNotificationPageProps {
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
    namespace: 'application.merchant_order_notification.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function MerchantOrderNotificationPage({
  params,
}: MerchantOrderNotificationPageProps) {
  return <MerchantOrderNotificationPageServerWithSuspense />;
}

export default MerchantOrderNotificationPage;
