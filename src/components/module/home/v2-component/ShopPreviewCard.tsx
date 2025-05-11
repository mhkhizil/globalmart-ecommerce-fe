import Image from 'next/image';

import { Shop, ShopType } from '@/core/entity/Shop';

function ShopPreviewCard(props: ShopType) {
  const { id, img_url, name, status } = props;
  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <Image
        src={img_url}
        alt={name}
        width={512}
        height={512}
        className="h-[80px] rounded-[8px]"
      />
      <span className="text-center text-[0.8rem] leading-4 font-poppins font-[500]">
        {name}
      </span>
    </div>
  );
}

export default ShopPreviewCard;
