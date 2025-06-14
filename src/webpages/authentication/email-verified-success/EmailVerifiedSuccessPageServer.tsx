import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import EmailVerifiedSuccessPageClient from './EmailVerifiedSuccessPageClient';

function EmailVerifiedSuccessPageServer() {
  return <EmailVerifiedSuccessPageClient />;
}

export default function EmailVerifiedSuccessPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <EmailVerifiedSuccessPageServer />
    </Suspense>
  );
}
