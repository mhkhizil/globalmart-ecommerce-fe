import MerchantRegister from '@/components/module/authentication/merchant-register/MerchantRegister';
import { ShopType } from '@/core/entity/Shop';

interface InputPorps {
  shopList: ShopType[];
  countryList: any;
  stateList: any;
  cityList: any;
}

function MerchantRegisterPageClient(props: InputPorps) {
  return <MerchantRegister {...props} />;
}
export default MerchantRegisterPageClient;
