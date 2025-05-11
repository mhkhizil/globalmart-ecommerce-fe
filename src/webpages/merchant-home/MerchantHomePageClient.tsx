'use client';

import MerchantHome from '@/components/module/merchant-home/MerchantHome';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

interface IPageProps {
  merchant_id: number;
}

function MerchantHomePageClient(props: IPageProps) {
  return <MerchantHome {...props} />;
}
export default withMerchantAuth(MerchantHomePageClient);
