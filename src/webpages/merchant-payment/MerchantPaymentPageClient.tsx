'use client';

import { MerchantPaymentV2 } from '@/components/module/merchant-payment/MerchantPaymentV2';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

function MerchantPaymentPageClient() {
  return <MerchantPaymentV2 />;
}
export default withMerchantAuth(MerchantPaymentPageClient);
