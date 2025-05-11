import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MerchantWithdrawHistoryPageServerWithSuspense from '@/webpages/merchant-withdraw-history/MerchantWithdrawHistoryPageServer';

interface MerchantWithdrawHistoryPageProps {
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
    namespace: 'application.merchant_withdraw_history.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function MerchantWithdrawHistoryPage({
  params,
}: MerchantWithdrawHistoryPageProps) {
  return <MerchantWithdrawHistoryPageServerWithSuspense />;
}

export default MerchantWithdrawHistoryPage;
