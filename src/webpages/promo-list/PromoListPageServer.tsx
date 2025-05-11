import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import PromoListPageClient from './PromoListPageClient';

function PromoListPageServer() {
  return <PromoListPageClient />;
}

export default function PromoListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <PromoListPageServer />
    </Suspense>
  );
}
