import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CustomerPaymentSelectionPageServerWithSuspense from '@/webpages/customer-payment-selection/CustomerPaymentSelectionPageServer';

interface CustomerPaymentSelectionPageProps {
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
    namespace: 'application.customer_payment_selection.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function CustomerPaymentSelectionPage({
  params,
}: CustomerPaymentSelectionPageProps) {
  return <CustomerPaymentSelectionPageServerWithSuspense />;
}

export default CustomerPaymentSelectionPage;
