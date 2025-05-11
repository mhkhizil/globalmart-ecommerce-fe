export interface DriverOrderDto {
  order_id: number;
  order_date: string;
  order_no: string;
  voucher_no: string;
  merchant_id: number;
  merchant_name: string;
  driver_id: number;
  driver_name: string;
  driver_contact_number: string;
  order_total: string;
  status: number;
  delivery_status: number;
  user_name: string;
  user_email: string;
  user_phone_code: string;
  user_phone: string;
  user_address: string;
}

export interface DriverOrderListResponseDto {
  order_items: DriverOrderDto[];
}
export interface DriverOrderListRequestDto {
  driver_id: number;
  delivery_status?: number;
  page: number;
  per_page: number;
}

export interface DriverOrderDetailRequestDto {
  order_id: number;
  driver_id: number;
}

export interface DailyCompletedOrderCountByDriverIdFilterDto {
  driver_id: number;
}
