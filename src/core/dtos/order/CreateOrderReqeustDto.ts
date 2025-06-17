import { OrderItem } from '@/core/entity/Order';

// export type CreateOrderRequestDto = {
//   date: string;
//   order_items: Omit<
//     OrderItem,
//     'id' | 'order_id' | 'total' | 'total' | 'created_at' | 'updated_at'
//   >[];
// };

export enum PaymentMethod {
  WALLET = 1,
  COD = 2,
}

export type CreateOrderRequestDto = {
  date: string;
  payment_method: PaymentMethod;
  merchant_id: number;
  coupon_id?: number; // Optional coupon ID
  order_items: Omit<
    OrderItem,
    | 'id'
    | 'order_id'
    | 'order_no'
    | 'voucher_no'
    | 'order_date'
    | 'merchant_name'
    | 'driver_id'
    | 'driver_name'
    | 'driver_contact_number'
    | 'status'
    | 'promo_code'
    | 'discount_id'
    | 'total'
    | 'confirmation_time'
    | 'created_at'
    | 'updated_at'
    | 'shop_name'
    | 'order_total'
    | 'remark'
    | 'delivery_status'
    | 'driver'
  >[];
  shipping_address?: {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
  };
};
