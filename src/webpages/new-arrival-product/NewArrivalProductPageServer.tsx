import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import NewArrivalProductPageClient from './NewArrivalProductPageClient';

function NewArrivalProductPageServer() {
  return <NewArrivalProductPageClient />;
}

export default function NewArrivalProductPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <NewArrivalProductPageServer />
    </Suspense>
  );
}
