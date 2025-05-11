'use client';

import MerchantShopList from '@/components/module/merchant-shop-list/MerchantShopList';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

function MerchantShopListPageClient() {
  return <MerchantShopList />;
}
export default withMerchantAuth(MerchantShopListPageClient);
