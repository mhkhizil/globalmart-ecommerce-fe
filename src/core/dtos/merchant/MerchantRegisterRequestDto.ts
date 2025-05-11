export type MerchantRegisterRequestDto = {
  email: string;
  password: string;
  confirm_password: string;
  country_id: string;
  state_id: string;
  city_id: string;
  phone_code: any;
  phone: string;
  name: string;
  address: string;
  latlong: string;
  s_id: number;
  shop_type_id: number;
};
