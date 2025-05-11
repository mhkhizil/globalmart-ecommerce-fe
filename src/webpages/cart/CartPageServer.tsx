import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import CartPageClient from './CartPageClient';

function CartPageServer() {
  return <CartPageClient />;
}

export default function CartPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <CartPageServer />
    </Suspense>
  );
}
