import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import TrendingProductPageClient from './TrendingProductPageClient';

function TrendingProductPageServer() {
  return <TrendingProductPageClient />;
}

export default function TrendingProductPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <TrendingProductPageServer />
    </Suspense>
  );
}
