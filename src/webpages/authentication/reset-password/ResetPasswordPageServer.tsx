import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import ResetPasswordPageClient from './ResetPasswordPageClient';

function ResetPasswordPageServer() {
  return <ResetPasswordPageClient />;
}

export default function ResetPasswordPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <ResetPasswordPageServer />
    </Suspense>
  );
}
