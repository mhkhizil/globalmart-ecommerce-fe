import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import CustomerWalletPageClient from './CustomerWalletPageClient';

function CustomerWalletPageServer() {
  return <CustomerWalletPageClient />;
}

export default function CustomerWalletPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <CustomerWalletPageServer />
    </Suspense>
  );
}
