import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantProductListPageClient from './MerchantProductListPageClient';

function MerchantProductListPageServer() {
  return <MerchantProductListPageClient />;
}

export default function MerchantProductListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantProductListPageServer />
    </Suspense>
  );
}
