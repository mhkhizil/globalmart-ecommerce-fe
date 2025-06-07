import { Suspense } from 'react';

import Loader from '@/components/common/loader/Loader';

import ShoppingBagClient from './ShoppingBagClient';

function ShoppingBagServer() {
  return (
    <Suspense fallback={<Loader />}>
      <ShoppingBagClient />
    </Suspense>
  );
}

export default ShoppingBagServer;
