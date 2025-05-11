import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CustomerWalletPageServerWithSuspense from '@/webpages/customer-wallet/CustomerWalletPageServer';

interface CustomerWalletPageProps {
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
    namespace: 'application.customer_wallet.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function CustomerWalletPage({ params }: CustomerWalletPageProps) {
  return <CustomerWalletPageServerWithSuspense />;
}

export default CustomerWalletPage;
