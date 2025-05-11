import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import EventListPageClient from './EventListPageClient';

function EventListPageServer() {
  return <EventListPageClient />;
}

export default function EventListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <EventListPageServer />
    </Suspense>
  );
}
