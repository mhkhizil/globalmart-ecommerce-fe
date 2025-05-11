import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { Order } from '@/core/entity/Order';

import UserOrderDetailPageClient from './UserOrderDetailPageClient';

interface IUserOrderDetailPageServerProps {
  id: string;
}

function UserOrderDetailPageServer(props: IUserOrderDetailPageServerProps) {
  return <UserOrderDetailPageClient id={props.id} />;
}

export default function UserOrderDetailPageServerWithSuspense(
  props: IUserOrderDetailPageServerProps
) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <UserOrderDetailPageServer {...props} />
    </Suspense>
  );
}
