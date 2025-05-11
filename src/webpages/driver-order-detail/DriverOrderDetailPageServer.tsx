import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import DriverOrderDetailPageClient from './DriverOrderDetailPageClient';

interface IOrderProps {
  id: string;
}

function DriverOrderDetailPageServer(props: IOrderProps) {
  return <DriverOrderDetailPageClient {...props} />;
}

export default function DriverOrderDetailPageServerWithSuspense(
  props: IOrderProps
) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <DriverOrderDetailPageServer {...props} />
    </Suspense>
  );
}
