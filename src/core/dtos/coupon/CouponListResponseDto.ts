export interface Coupon {
  id: number;
  coupon_code: string;
  description: string | null;
  start_date: string;
  end_date: string;
  use_count: number;
  valid_count: number;
  discount_type: 'fixed' | 'percentage';
  discount_percent: number | null;
  discount_amount: string | null;
  min_order_amount: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface CouponListResponseDto {
  status: string;
  message: string;
  data: {
    coupon: Coupon[];
  };
}
