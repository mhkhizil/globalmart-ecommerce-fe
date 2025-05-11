import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import ProductListByShopPageClient from './ProductListByShopPageClient';

function ProductListByShopPageServer() {
  return <ProductListByShopPageClient />;
}

export default function ProductListByShopPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <ProductListByShopPageServer />
    </Suspense>
  );
}
