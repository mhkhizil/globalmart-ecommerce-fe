'use client';

import { useTranslations } from 'next-intl';

import { ShopType } from '@/core/entity/Shop';

import MerchantProfileForm from './MerchantProfileForm';

interface InputProps {
  shopList: ShopType[];
}

function MerchantProfileRegister(props: InputProps) {
  const t = useTranslations();
  return (
    <div className="flex w-full h-[100dvh] overflow-y-auto pb-[2rem] flex-col px-[24px]">
      <span className="text-[32px] font-semibold leading-[40px]  mt-[32px]">
        {t('merchantPaymentForm.completeYourBusinessProfile')}
      </span>

      <span className="text-[14px] font-[500] leading-[20px] text-[#878787] mt-[8px]">
        {t('merchantPaymentForm.completeYourMerchantProfile')}
      </span>
      <div className="flex w-full items-center justify-center mb-[24px] mt-[32px]">
        <MerchantProfileForm {...props} />
      </div>
    </div>
  );
}
export default MerchantProfileRegister;
