import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantProductCreatePageClient from './MerchantProductCreatePageClient';

function MerchantProductCreatePageServer() {
  return <MerchantProductCreatePageClient />;
}

export default function MerchantProductCreatePageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantProductCreatePageServer />
    </Suspense>
  );
}
