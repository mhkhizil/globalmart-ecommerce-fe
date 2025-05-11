export interface DriverDto {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface DriverListResponseDto {
  drivers: Array<{
    id: number;
    name: string;
    contact_number: string;
    latlong: string;
    cur_latlong: string;
    created_at: string;
    updated_at: string;
    merchant_id: number;
    image: string | null;
    process: string | null;
    user_id: number | null;
  }>;
}

export interface CreateDriverDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateDriverDto {
  name: string;
  email: string;
  phone: string;
}

export interface GetDriverListByMerchantIdRequestDto {
  merchant_id: number;
}
