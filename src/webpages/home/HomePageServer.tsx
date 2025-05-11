import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import HomePageClient from './HomePageClient';

function HomePageServer() {
  return <HomePageClient />;
}

export default function HomePageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <HomePageServer />
    </Suspense>
  );
}
