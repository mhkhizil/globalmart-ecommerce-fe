import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import GetStartedPageClient from './GetStartedPageClient';

function GetStartedPageServer() {
  return <GetStartedPageClient />;
}

export default function GetStartedPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <GetStartedPageServer />
    </Suspense>
  );
}
