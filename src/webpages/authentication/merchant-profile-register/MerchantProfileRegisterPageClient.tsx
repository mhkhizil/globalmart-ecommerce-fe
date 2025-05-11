'use client';

import MerchantProfileRegister from '@/components/module/merchant-profile/MerchantProfileRegister';
import { ShopType } from '@/core/entity/Shop';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

interface InputProps {
  shopList: ShopType[];
}

function MerchantProfileRegisterPageClient(props: InputProps) {
  return <MerchantProfileRegister {...props} />;
}
export default withMerchantAuth(MerchantProfileRegisterPageClient);
