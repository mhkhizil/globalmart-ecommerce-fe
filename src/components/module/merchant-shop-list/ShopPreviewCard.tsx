import Image from 'next/image';

import { Shop } from '@/core/entity/Shop';

interface InputProps {
  shop?: Shop;
}

function ShopPreviewCard(props: InputProps) {
  return (
    <div className="flex w-full px-[10px] py-[10px] bg-gray-200/50 rounded-[10px] shadow-md gap-x-4">
      {props.shop?.image && (
        <Image
          src={props.shop?.image}
          alt="logo"
          width={512}
          height={512}
          className="h-[5rem] min-w-[2rem] max-w-[5rem] rounded-[5px] "
        />
      )}
      {!props.shop?.image && (
        <div className="h-[5rem] min-w-[5rem] rounded-[5px] bg-[#FE8C00] flex items-center justify-center">
          <span className="text-white">Shop</span>
        </div>
      )}
      <div className="flex w-full flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <span className="text-gray-500 font-bold">{props.shop?.name}</span>
          {/* <div className="h-[1.2rem] w-[1px] bg-gray-400"></div>
          <span className="text-gray-400 text-sm">
            Shop type
          </span> */}
        </div>
        <span className="text-gray-400 text-sm">{props.shop?.addr}</span>
      </div>
    </div>
  );
}
export default ShopPreviewCard;
