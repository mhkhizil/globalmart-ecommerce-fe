'use client';
import MerchantWithdrawHistory from '@/components/module/merchant-withdraw-history/MerchantWithdrawHistory';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

function MerchantWithdrawHistoryPageClient() {
  return <MerchantWithdrawHistory />;
}
export default withMerchantAuth(MerchantWithdrawHistoryPageClient);
