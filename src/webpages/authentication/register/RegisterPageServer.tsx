import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import RegisterPageClient from './RegisterPageClient';

function RegisterPageServer() {
  return <RegisterPageClient />;
}

export default function RegisterPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <RegisterPageServer />
    </Suspense>
  );
}
