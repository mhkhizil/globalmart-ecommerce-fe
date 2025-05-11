'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import LikeIcon from '@/components/common/icons/LikeIcon';
import LocationIcon from '@/components/common/icons/LocationIcon';
import SpoonAndForkIcon from '@/components/common/icons/SpoonAndForkIcon';
import { ShopType } from '@/core/entity/Shop';

import Body from './v2-component/Body';

interface InputPorps {
  shopList: ShopType[];
}

function HomeV2(props: InputPorps) {
  const router = useRouter();
  const { shopList } = props;
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
    <div className="flex w-full flex-col relative h-[93dvh] overflow-y-auto scrollbar-none bg-[#FE8C00]">
      {/* <Header /> */}
      <div className="flex w-full justify-between items-center px-[1.2rem] pt-[1rem]">
        <div className="flex items-center gap-x-3">
          <LocationIcon />
          <div className="flex flex-col">
            {address && (
              <>
                <span className="text-white text-[1rem]  font-[600]">
                  {`${address?.address?.quarter}, ${address?.address?.suburb}`}
                </span>
                <span className="text-white text-[0.8rem]  font-[600]">
                  {`${address?.address?.city}, ${address?.address?.country}`}
                </span>
              </>
            )}
            {!address && <span className="text-white">--</span>}
          </div>
        </div>
        <div className="flex">
          <LikeIcon isLiked={false} />
        </div>
      </div>
      <div className="flex w-full justify-center px-[1.5rem] py-[1.5rem] sticky top-0  z-50 bg-[#FE8C00] rounded-b-[10px]">
        <div
          onClick={event => {
            event.stopPropagation();
            router.push('/application/search');
          }}
          className="flex w-full items-center border-[1px] bg-white rounded-[15px] py-[0.3rem] px-[0.2rem] gap-x-2"
        >
          <SearchIcon color="#FE8C00" />
          {/* <input
            className="flex w-full rounded-[10px] focus:outline-none px-[0.3rem]"
            placeholder="search your food"
          /> */}
          <button className="flex w-full text-gray-400">search you food</button>
        </div>
      </div>
      <div className="flex w-full  items-center justify-center pt-[0.5rem] mb-[5rem] px-[1rem]">
        <span className="text-[2rem]  flex items-center justify-center gap-y-1 text-wrap leading-[1.5rem] font-merienda font-[700] italic text-white">
          &quot;Takeout Made Tastier.&quot;
        </span>
        {/* <div className="w-[20%]">
          <SpoonAndForkIcon />
        </div> */}
      </div>
      <Body shopList={shopList} />
    </div>
  );
}
export default HomeV2;
