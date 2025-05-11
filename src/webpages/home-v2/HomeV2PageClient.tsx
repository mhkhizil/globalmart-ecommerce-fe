import HomeV2 from '@/components/module/home/HomeV2';
import { ShopType } from '@/core/entity/Shop';

interface InputPorps {
  shopList: ShopType[];
}

function HomeV2PageClient(props: InputPorps) {
  const { shopList } = props;
  return <HomeV2 shopList={shopList} />;
}
export default HomeV2PageClient;
