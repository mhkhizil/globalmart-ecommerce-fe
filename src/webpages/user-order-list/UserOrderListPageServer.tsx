import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import UserOrderListPageClient from './UserOrderListPageClient';

function UserOrderListPageServer() {
  return <UserOrderListPageClient />;
}

export default function UserOrderListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <UserOrderListPageServer />
    </Suspense>
  );
}
