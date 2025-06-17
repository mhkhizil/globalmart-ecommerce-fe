export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  merchant_id: number;
  type?: 'percentage' | 'fixed';
  discount_percent?: number;
  discount_amount?: string;
  discount_price?: number;
  image?: string;
  customization?: Record<string, any>;
}

export interface AppliedCoupon {
  id: number;
  coupon_code: string;
  discount_amount: number;
  discount_type: 'fixed' | 'percentage';
  discount_percent?: number;
  min_order_amount: string;
}

export interface CartState {
  carts: {
    [userId: string]: {
      items: CartItem[];
      appliedCoupon?: AppliedCoupon;
      lastUpdated: number;
      version: number;
    };
  };
  currentUserId: string | undefined;
}
