import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import DriverHomePageClient from './DriverHomePageClient';

function DriverHomePageServer() {
  return <DriverHomePageClient />;
}

export default function DriverHomePageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <DriverHomePageServer />
    </Suspense>
  );
}
