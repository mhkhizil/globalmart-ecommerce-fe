import { Shop, ShopType } from '@/core/entity/Shop';

import BrandPreview from './BrandPreview';
import Category from './Category';
import ProductPreview from './ProductPreview';
import Promotion from './Promotion';
import ShopListPreview from './ShopList';

interface InputPorps {
  shopList: ShopType[];
}

function Body(props: InputPorps) {
  const { shopList } = props;
  return (
    <div className="bg-white flex w-full flex-1 flex-col rounded-t-[20px] ">
      <div className="flex w-full px-[1.5rem]">
        <Category />
      </div>
      <Promotion />
      <ProductPreview />
      <ShopListPreview shopList={shopList} />
      <BrandPreview />
    </div>
  );
}
export default Body;
