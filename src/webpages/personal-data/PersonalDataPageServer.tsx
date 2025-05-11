import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import PersonalDataPageClient from './PersonalDataPageClient';

function PersonalDataPageServer() {
  return <PersonalDataPageClient />;
}

export default function PersonalDataPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <PersonalDataPageServer />
    </Suspense>
  );
}
