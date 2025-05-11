import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import ProfilePageClient from './ProfilePageClient';

function ProfilePageServer() {
  return <ProfilePageClient />;
}

export default function ProfilePageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <ProfilePageServer />
    </Suspense>
  );
}
