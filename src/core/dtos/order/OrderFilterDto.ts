export type OrderFilterDto = {
  merchant_id: number;
  status?: number;
  category_id?: number;
  page: number;
  per_page: number;
};

export type OrderCountFilterDto = {
  merchant_id: number;
  status?: number;
};

export type DriverOrderListCountFilterDto = {
  driver_id: number;
  delivery_status?: number;
};

export type CustomerOrderListFilterDto = {
  user_id: number;
  status?: number;
  page?: number;
  per_page?: number;
};

export type MerchantOrderDetailDto = {
  merchant_id: number;
  order_id: number;
};
