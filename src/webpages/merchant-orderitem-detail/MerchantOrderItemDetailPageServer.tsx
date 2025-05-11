import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { OrderItem } from '@/core/entity/Order';

import MerchantOrderItemDetailPageClient from './MerchantOrderitemDetailPageClient';

interface IOrderItemProps {
  id: string;
}

function MerchantOrderItemDetailPageServer(props: IOrderItemProps) {
  return <MerchantOrderItemDetailPageClient {...props} />;
}

export default function MerchantOrderItemDetailPageServerWithSuspense(
  props: IOrderItemProps
) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantOrderItemDetailPageServer {...props} />
    </Suspense>
  );
}
