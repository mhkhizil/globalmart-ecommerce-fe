import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import TransactionHistoryPageServerWithSuspense from '@/webpages/transaction-history/TransactionHistoryPageServer';

interface TransactionHistoryPageProps {
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
    namespace: 'application.transaction_history.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function TransactionHistoryPage({ params }: TransactionHistoryPageProps) {
  return <TransactionHistoryPageServerWithSuspense />;
}

export default TransactionHistoryPage;
