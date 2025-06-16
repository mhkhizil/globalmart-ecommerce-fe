import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import DealOfTheDayPageClient from './DealOfTheDayPageClient';

function DealOfTheDayPageServer() {
  return <DealOfTheDayPageClient />;
}

export default function DealOfTheDayPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <DealOfTheDayPageServer />
    </Suspense>
  );
}
