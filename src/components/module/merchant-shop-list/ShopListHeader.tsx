'use client';

import { Bell } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import ArrowDownIcon from '@/components/common/icons/ArrowDownIcon';
import LocationIcon from '@/components/common/icons/LocationIcon';
import NotificationIcon from '@/components/common/icons/NotificationIcon';
import SearchIcon from '@/components/common/icons/SearchIcon';

import OrderNotiBell from '../merchant-order/OrderNotiBell';

function ShopListHeader() {
  const t = useTranslations();
  const [address, setAddress] = useState<any>();
  useEffect(() => {
    if ('geolocation' in navigator && !address) {
      navigator.geolocation.getCurrentPosition(async position => {
        // setValue(
        //   'latlong',
        //   `${position.coords.latitude}|${position.coords.longitude}`
        // );
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        setAddress(data);
      });
    }
  }, [address, setAddress]);
  return (
    <div className="relative flex w-full sm:min-h-[30dvh] pt-[1.5rem] pb-[1.25rem] px-[1.5rem] flex-col">
      <div className="flex w-full z-10 text-white">
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-[0.6875rem]">
            <div className="text-[0.875rem] leading-[1.25rem]">
              {t('merchantShopList.yourLocation')}
            </div>
            <>
              <ArrowDownIcon />
            </>
          </div>
          <div className="flex items-center gap-x-[0.5rem] mt-[0.75rem]">
            <div className="flex-shrink-0 flex">
              <LocationIcon />
            </div>
            <div className="flex flex-col">
              {address && (
                <>
                  <span className="text-[#EAEAEA] text-[1rem]  font-[600]">
                    {`${address?.address?.quarter}, ${address?.address?.suburb}`}
                  </span>
                  <span className="text-[#EAEAEA] text-[0.8rem]  font-[600]">
                    {`${address?.address?.city}, ${address?.address?.country}`}
                  </span>
                </>
              )}
              {!address && <span>--</span>}
            </div>
          </div>
        </div>
        <div>
          <OrderNotiBell />
        </div>
      </div>
      <div className="flex w-full items-center text-center font-merienda justify-center flex-col z-10 text-white font-semibold text-[1.7rem] leading-[2.5rem] mt-[1rem]">
        <span>{t('merchantShopList.businessTagline')}</span>
      </div>
    </div>
  );
}
export default ShopListHeader;
