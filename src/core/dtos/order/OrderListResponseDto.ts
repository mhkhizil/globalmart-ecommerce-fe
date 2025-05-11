import { Order, OrderItem } from '@/core/entity/Order';

export type OrderListResponseDto = {
  order_items: OrderItem[];
};

export type CustomerOrderListResponseDto = {
  order: Order[];
};

export type OrderItemListResponseByVoucherNo = Array<{
  category_name: string;
  status: number;
  product_name: string;
  quantity: number;
  price: string;
  discount_amt: string;
  total: string;
}>;

export type OrderItemListRequestByVoucherNo = {
  order_id: number;
  merchant_id: number;
};
