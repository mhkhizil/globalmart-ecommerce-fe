import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

import MerchantProfileRegisterPageClient from './MerchantProfileRegisterPageClient';

async function MerchantProfileRegisterPageServer() {
  const commonService = new CommonService(
    new CommonRepository(new AxiosCustomClient())
  );
  let shopList;
  try {
    shopList = await commonService.getShopList();
  } catch {}
  return (
    <MerchantProfileRegisterPageClient shopList={shopList?.shoptypes || []} />
  );
}

export default function MerchantProfileRegisterPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantProfileRegisterPageServer />
    </Suspense>
  );
}
