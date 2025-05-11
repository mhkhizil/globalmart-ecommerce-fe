import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import ForgotPasswordPageClient from './ForgotPasswordPageClient';

function ForgotPasswordPageServer() {
  return <ForgotPasswordPageClient />;
}

export default function ForgotPasswordPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <ForgotPasswordPageServer />
    </Suspense>
  );
}
