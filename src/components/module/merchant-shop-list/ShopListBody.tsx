'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Skeleton } from '@/components/ui/skeleton';
import { GetMerchantShopListRequestDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListRequestDto';
import { useGetShopListByMerchantId } from '@/lib/hooks/service/shop/useGetShopsByMerchantId';
import { useSession } from '@/lib/hooks/session/useSession';

import ShopPreviewCard from './ShopPreviewCard';

function ShopListBody() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const t = useTranslations();
  const merchantId = sessionData?.user?.merchant_id;
  const [isFloatButton, setIsFloatButton] = useState<boolean>(false);
  const { data: shopList, isLoading } = useGetShopListByMerchantId(
    merchantId
      ? { merchant_id: merchantId }
      : ({} as GetMerchantShopListRequestDto),

    {
      enabled: !!sessionData, // Ensures the query runs only when sessionData.user.id is defined
    }
  );
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      setIsFloatButton(false);
    } else {
      setIsFloatButton(true);
    }
  }, [inView]);

  return (
    <div className="flex w-full flex-col items-center justify-start bg-white flex-1 rounded-t-[20px] pt-[1.5rem] pb-[2rem] relative">
      {isFloatButton && (
        <motion.button
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0.5 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: 0,
          }}
          onClick={() => router.push('/shop-register')}
          className="sticky w-[90%] top-2 flex gap-x-2 items-center justify-center  transform bg-[#FE8C00] text-white font-bold py-2 px-6 rounded-[10px] shadow-lg"
        >
          <Plus /> {t('merchantShopList.createShop')}
        </motion.button>
      )}
      <div className="flex w-full justify-between px-[1.5rem] mb-[1.5rem] items-center">
        <span className="text-[1.5rem] leading-[1rem] font-[550] ">
          {t('merchantShopList.shopList')}
        </span>
        <button
          ref={ref}
          onClick={() => router.push('/shop-register')}
          className="size-[2rem] rounded-full bg-[#FE8C00] flex items-center justify-center"
        >
          <Plus color="white" />
        </button>
      </div>
      <div className="flex w-full flex-col px-[1.5rem] gap-y-4">
        {!isLoading &&
          shopList &&
          shopList?.shops?.length > 0 &&
          shopList?.shops?.map((shop, index) => {
            return (
              <div
                onClick={() => {
                  const parameter = new URLSearchParams();
                  parameter.append('shopId', shop.id.toString());
                  router.push(`/application/merchant-shop-detail?${parameter}`);
                }}
                className="flex w-full"
                key={index}
              >
                <ShopPreviewCard shop={shop} />
              </div>
            );
          })}
        {isLoading && (
          <>
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div className="flex w-full gap-x-2" key={index}>
                  <Skeleton className="w-[5rem] h-[5rem]" />
                  <Skeleton className="w-full h-[5rem]" />
                </div>
              ))}
          </>
        )}
        {!isLoading && (shopList?.shops?.length || 0) < 1 && (
          <div className="flex w-full items-center justify-center text-gray-400">
            {t('merchantShopList.noShopAvailable')}
          </div>
        )}
      </div>
    </div>
  );
}
export default ShopListBody;
