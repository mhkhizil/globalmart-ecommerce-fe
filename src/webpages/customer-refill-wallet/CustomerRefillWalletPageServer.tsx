import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import CustomerRefillWalletPageClient from './CustomerRefillWalletPageClient';

function CustomerRefillWalletPageServer() {
  return <CustomerRefillWalletPageClient />;
}

export default function CustomerRefillWalletPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <CustomerRefillWalletPageServer />
    </Suspense>
  );
}
