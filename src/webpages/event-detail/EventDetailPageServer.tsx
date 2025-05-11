import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import EventDetailPageClient from './EventDetailPageClient';

interface IOrderProps {
  id: string;
}

function EventDetailPageServer(props: IOrderProps) {
  return <EventDetailPageClient {...props} />;
}

export default function EventDetailPageServerWithSuspense(props: IOrderProps) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <EventDetailPageServer {...props} />
    </Suspense>
  );
}
