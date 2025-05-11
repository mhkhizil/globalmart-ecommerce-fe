'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Skeleton } from '@/components/ui/skeleton';
import { Shop } from '@/core/entity/Shop';
import { RootState } from '@/lib/redux/ReduxStore';

import MerchantProductPreviewList from './MerchantProductPreviewList';
import FlipTabs from './MerchantProfileToggleCard';

interface InputProps {
  isLoading: boolean;
  shopDetail: Shop | undefined;
}

function MerchantProfileDetailBody(props: InputProps) {
  const { isLoading, shopDetail } = props;
  const selectedLanguage = useSelector(
    (state: RootState) => state.language.locale
  );
  //console.log(shopDetail);
  const safeShopDetail = useMemo(() => {
    return (
      shopDetail || {
        name: '--',
        shop_type_id: '--',
        addr: '--',
        phone: '--',
        opening_time: '--',
        closing_time: '--',
        description: '--',
        en_addr: '--',
        mm_addr: '--',
        th_addr: '--',
        cn_addr: '--',
        en_description: '--',
        mm_description: '--',
        th_description: '--',
        cn_description: '--',
      }
    );
  }, [shopDetail]);
  return (
    <div className="flex w-full h-[50dvh] flex-col px-[1.5rem] pt-[1rem] bg-white rounded-t-[2rem] z-20">
      {!isLoading && (
        <>
          {' '}
          <div className="flex w-full gap-x-7 items-start">
            <Image
              src={shopDetail?.image || ''}
              alt="logo"
              width={512}
              height={512}
              className="h-[5rem] w-[5rem] rounded-[5px]"
            />
            <div className="flex flex-col items-start">
              <span className="text-[1.5rem] font-[600] text-wrap">
                {safeShopDetail?.name}
              </span>
              <span className="text-[0.9rem] text-gray-400 font-[600]">
                {safeShopDetail?.shop_type_id}
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col mt-[1rem] items-start justify-start gap-y-[0.5rem]">
            <div className="flex items-center gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#BE3144"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span className="text-[0.8rem] text-gray-500 font-[600]">
                {selectedLanguage === 'mm'
                  ? safeShopDetail?.mm_addr || '--'
                  : selectedLanguage === 'th'
                    ? safeShopDetail?.th_addr || '--'
                    : selectedLanguage === 'cn'
                      ? safeShopDetail?.cn_addr || '--'
                      : safeShopDetail?.en_addr || '--'}
              </span>
            </div>
            <div className="flex items-center gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#BE3144"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>

              <span className="text-[0.8rem] text-gray-500 font-[600]">
                {safeShopDetail?.phone}
              </span>
            </div>
            <div className="flex items-center gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#BE3144"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <span className="text-[0.8rem] text-gray-500 font-[600]">
                {safeShopDetail?.opening_time} - {safeShopDetail?.closing_time}
              </span>
            </div>
          </div>
          <div className="flex w-full mt-[1rem] mb-[0.5rem]">
            <FlipTabs
              description={
                selectedLanguage === 'mm'
                  ? safeShopDetail?.mm_description
                  : selectedLanguage === 'th'
                    ? safeShopDetail?.th_description
                    : selectedLanguage === 'cn'
                      ? safeShopDetail?.cn_description
                      : safeShopDetail?.en_description
              }
            />
          </div>
          <Link
            href={'/application/merchant-payment'}
            className="flex w-full items-center bg-[#FE8C00] justify-center gap-x-2 mb-[1.5rem] border-[1px] rounded-[6px] py-[0.5rem] shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
            <span className="text-white leading-[1rem] text-[0.8rem] font-[500] font-poppins">
              View Payment
            </span>
          </Link>
          <MerchantProductPreviewList />
        </>
      )}

      {isLoading && (
        <>
          <div className="flex w-full gap-x-4 items-start">
            <Skeleton className="h-[5rem] w-[6rem] rounded-[5px] bg-gray-100/90" />
            <div className="flex w-full flex-col items-start gap-y-3 pt-[1rem]">
              <Skeleton className="flex w-full h-[1rem]" />
              <Skeleton className="flex w-full h-[1rem]" />
            </div>
          </div>
          <div className="flex w-full flex-col mt-[1rem] items-start justify-start gap-y-[0.7rem]">
            <Skeleton className="flex w-full h-[1rem]" />
            <Skeleton className="flex w-full h-[1rem]" />
            <Skeleton className="flex w-full h-[1rem]" />
          </div>
          <div className="flex w-full mt-[1rem] mb-[0.5rem]">
            <Skeleton className="flex w-full h-[3rem]" />
          </div>
          <div className="flex w-full mt-[1rem] mb-[0.5rem]">
            <Skeleton className="flex w-full h-[8rem]" />
          </div>
        </>
      )}
    </div>
  );
}
export default MerchantProfileDetailBody;
