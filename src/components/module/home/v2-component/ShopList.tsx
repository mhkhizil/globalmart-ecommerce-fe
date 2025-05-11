import { Shop, ShopType } from '@/core/entity/Shop';

import ShopPreviewCard from './ShopPreviewCard';

interface InputPorps {
  shopList: ShopType[];
}

function ShopListPreview(props: InputPorps) {
  const { shopList } = props;

  return (
    <div className="flex flex-col w-full mt-[1.5rem]">
      <div className="flex w-full items-center justify-between px-[1.2rem]">
        <span className="text-[1rem] font-[600] leading-[1.8rem]">
          Shop Types
        </span>
      </div>
      <div className="flex w-full space-x-4 px-4 py-1 scrollbar-none overflow-x-auto">
        {shopList.map((shop, index) => {
          return (
            <div className="w-[20dvw] sm:w-[80px] flex-shrink-0" key={index}>
              <ShopPreviewCard {...shop} />
            </div>
          );
        })}
        {shopList.length === 0 && (
          <div className="flex w-full items-center justify-center text-gray-400/70">
            No shop available
          </div>
        )}
      </div>
    </div>
  );
}
export default ShopListPreview;
