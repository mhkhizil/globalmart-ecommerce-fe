import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import CustomerPaymentSelectionPageClient from './CustomerPaymentSelectionPageClient';

function CustomerPaymentSelectionPageServer() {
  return <CustomerPaymentSelectionPageClient />;
}

export default function CustomerPaymentSelectionPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <CustomerPaymentSelectionPageServer />
    </Suspense>
  );
}
