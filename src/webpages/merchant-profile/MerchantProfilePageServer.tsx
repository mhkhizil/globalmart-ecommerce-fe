import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantProfilePageClient from './MerchantProfilePageClient';

function MerchantProfilePageServer() {
  return <MerchantProfilePageClient />;
}

export default function MerchantProfilePageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantProfilePageServer />
    </Suspense>
  );
}
