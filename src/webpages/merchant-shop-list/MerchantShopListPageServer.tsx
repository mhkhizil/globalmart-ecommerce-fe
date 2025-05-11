import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantShopListPageClient from './MerchantShopListPageClient';

function MerchantShopListPageServer() {
  return <MerchantShopListPageClient />;
}

export default function MerchantShopListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantShopListPageServer />
    </Suspense>
  );
}
