import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantPaymentPageServerWithSuspense from '@/webpages/merchant-payment/MerchantPaymentPageServer';

interface MerchantPaymentPageProps {
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
    namespace: 'application.merchant_payment.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function MerchantPaymentPage({ params }: MerchantPaymentPageProps) {
  return <MerchantPaymentPageServerWithSuspense />;
}

export default MerchantPaymentPage;
