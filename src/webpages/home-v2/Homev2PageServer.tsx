'use server';

import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

import HomeV2PageClient from './HomeV2PageClient';

async function HomeV2PageServer() {
  const commonService = new CommonService(
    new CommonRepository(new AxiosCustomClient())
  );
  let shopList;
  try {
    const shops = await commonService.getShopList();
    shopList = shops;
  } catch {}
  return <HomeV2PageClient shopList={shopList?.shoptypes ?? []} />;
}

export default async function HomeV2PageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <HomeV2PageServer />
    </Suspense>
  );
}
