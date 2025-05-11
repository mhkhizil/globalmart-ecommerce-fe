export interface CreateDiscountRequestDto {
  start_date: string;
  end_date: string;
  merchant_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  type: 'percentage' | 'fixed';
  discount_percent: number;
  discount_amount: number;
  discount_price: number;
}

export interface CreateDiscountResponseDto {
  start_date: string;
  end_date: string;
  merchant_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  type: string;
  discount_percent: number;
  discount_amount: number;
  discount_price: number;
  updated_at: string;
  created_at: string;
  id: number;
}
