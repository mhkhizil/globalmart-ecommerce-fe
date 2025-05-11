import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import RegisterDriverPageClient from './RegisterDriverClientPage';

function RegisterDriverPageServer() {
  return <RegisterDriverPageClient />;
}

export default function RegisterDriverPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <RegisterDriverPageServer />
    </Suspense>
  );
}
