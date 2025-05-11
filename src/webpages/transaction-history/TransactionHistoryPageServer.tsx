import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import TransactionHistoryPageClient from './TransactionHistoryPageClient';

function TransactionHistoryPageServer() {
  return <TransactionHistoryPageClient />;
}

export default function TransactionHistoryPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <TransactionHistoryPageServer />
    </Suspense>
  );
}
