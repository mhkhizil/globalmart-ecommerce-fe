export type GetUserByIdResponseDto = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | undefined;
  created_at: string;
  updated_at: string;
  phone_code: string | undefined;
  phone: string;
  postal_code: string | undefined;
  address: string | undefined;
  country_id: string | undefined;
  state_id: string | undefined;
  city_id: string | undefined;
  roles: number;
  image: string;
  latlong: string;
  gender: string;
};
