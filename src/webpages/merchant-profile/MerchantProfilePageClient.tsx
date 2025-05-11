'use client';

import MerchantProfileDetail from '@/components/module/merchant-profile/Merchant-profile-detail/MerchantProfileDetail';
import { withAuth } from '@/lib/hoc/with-auth';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

function MerchantProfilePageClient() {
  return <MerchantProfileDetail />;
}
export default withMerchantAuth(MerchantProfilePageClient);
