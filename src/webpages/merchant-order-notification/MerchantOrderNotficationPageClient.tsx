'use client';

import MerchantOrderNotificationList from '@/components/module/merchant-order/list/MerchantOrderNotificationList';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

function MerchantOrderNotificationPageClient() {
  return <MerchantOrderNotificationList />;
}
export default withMerchantAuth(MerchantOrderNotificationPageClient);
