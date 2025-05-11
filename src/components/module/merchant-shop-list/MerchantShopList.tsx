import ShopListBody from './ShopListBody';
import ShopListHeader from './ShopListHeader';

function MerchantShopList() {
  return (
    <div className="flex w-full h-full flex-col bg-[#FE8C00]">
      <ShopListHeader />
      <ShopListBody />
    </div>
  );
}
export default MerchantShopList;
