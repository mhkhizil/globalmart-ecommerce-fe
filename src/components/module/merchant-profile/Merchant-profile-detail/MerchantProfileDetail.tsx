'use client';

import { useSearchParams } from 'next/navigation';

import { useGetShopDetailById } from '@/lib/hooks/service/shop/useGetShopDetailById';

import MerchantProfileDetailBody from './ProfileBody';
import MerchantProfileHeader from './ProfileHeader';

function MerchantProfileDetail() {
  const searchParameter = useSearchParams();
  const shopId = searchParameter?.get('shopId') || '';
  // console.log(shopId);
  const { data: shopDetail, isLoading } = useGetShopDetailById(shopId, {
    enabled: !!shopId,
  });
  // console.log(shopDetail);
  return (
    <div className="flex w-full flex-col">
      {/* <MerchantProfileHeader
        coverImage={shopDetail?.cover_image || ''}
        isLoading={isLoading}
      /> */}
      <MerchantProfileDetailBody
        isLoading={isLoading}
        shopDetail={shopDetail}
      />
    </div>
  );
}
export default MerchantProfileDetail;
