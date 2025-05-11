'use client';

import MerchantProductList from '@/components/module/merchant-product-list/MerchantProductList';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

function MerchantProductListPageClient() {
  return <MerchantProductList />;
}
export default withMerchantAuth(MerchantProductListPageClient);
