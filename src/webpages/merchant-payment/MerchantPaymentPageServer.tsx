import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantPaymentPageClient from './MerchantPaymentPageClient';

function MerchantPaymentPageServer() {
  return <MerchantPaymentPageClient />;
}

export default function MerchantPaymentPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantPaymentPageServer />
    </Suspense>
  );
}
