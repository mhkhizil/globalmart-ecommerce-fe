import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CustomerRefillWalletPageServerWithSuspense from '@/webpages/customer-refill-wallet/CustomerRefillWalletPageServer';

interface CustomerRefillWalletPageProps {
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
    namespace: 'application.customer_wallet_refill.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function CustomerRefillWalletPage({
  params,
}: CustomerRefillWalletPageProps) {
  return <CustomerRefillWalletPageServerWithSuspense />;
}

export default CustomerRefillWalletPage;
