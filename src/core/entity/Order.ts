// export interface OrderItem {
//   id: number;
//   order_id: number;
//   merchant_id: number;
//   product_id: number;
//   name: string;
//   quantity: number;
//   discount_amt: number;
//   price: string;
//   total: string;
//   created_at: string;
//   updated_at: string;
// }

export interface OrderItem {
  id: number;
  order_id: number;
  order_no: string;
  voucher_no: string;
  shop_name: string;
  order_date: string;
  merchant_id: number;
  merchant_name: string;
  driver_id: number | null;
  driver_name: string | null;
  driver_contact_number: string | null;
  status: number;
  product_id: number;
  promo_code: string | null;
  name: string;
  quantity: number;
  price: string;
  discount_id: number | null;
  discount_amt: number;
  total: string;
  confirmation_time: string | null;
  created_at: string;
  updated_at: string;
  order_total: string;
  remark: string | null;
  delivery_status: number;
  driver: {
    id: number;
    name: string;
    phone: string;
  } | null;
}

export interface OrderNotificationItem {
  order_date: string;
  order_no: string;
  voucher_no: string;
  product_name: string;
  quantity: number;
}

export type Order = {
  id: number;
  order_no: string;
  voucher_no: string;
  date: string;
  status: number;
  isDelete: number;
  sub_total: string;
  discount_total: string;
  grand_total: string;
  user_id: number;
  confirmation_time: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};
