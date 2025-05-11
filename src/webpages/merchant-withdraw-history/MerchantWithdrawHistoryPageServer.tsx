import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantWithdrawHistoryPageClient from './MerchantWithdrawHistoryPageClient';

function MerchantWithdrawHistoryPageServer() {
  return <MerchantWithdrawHistoryPageClient />;
}

export default function MerchantWithdrawHistoryPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantWithdrawHistoryPageServer />
    </Suspense>
  );
}
