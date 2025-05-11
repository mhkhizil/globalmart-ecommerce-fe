import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import DriverOrderListPageClient from './DriverOrderListPageClient';

function DriverOrderListPageServer() {
  return <DriverOrderListPageClient />;
}

export default function DriverOrderListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <DriverOrderListPageServer />
    </Suspense>
  );
}
