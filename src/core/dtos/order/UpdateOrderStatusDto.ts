export type UpdateOrderStatusDto = {
  order_id: string;
  merchant_id: string;
};

export type UpdateDeliveryStatusDto = {
  order_id: number;
  delivery_status: number;
  merchant_id: number;
};

export type CancelOrderByDriverRequestDto = {
  order_id: number;
  merchant_id: number;
};
