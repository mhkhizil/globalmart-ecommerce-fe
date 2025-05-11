'use client';

import MerchantOrderList from '@/components/module/merchant-order/list/MerchantOrderList';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

interface IPageProps {
  categoryId: number;
  status: number;
  userId: any;
}

function MerchantOrderListPageClient(props: IPageProps) {
  return <MerchantOrderList {...props} showFilter />;
}
export default withMerchantAuth(MerchantOrderListPageClient);
