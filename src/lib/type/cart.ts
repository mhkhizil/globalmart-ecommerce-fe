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

export interface CartState {
  carts: {
    [userId: string]: {
      items: CartItem[];
      lastUpdated: number;
      version: number;
    };
  };
  currentUserId: string | undefined;
}
