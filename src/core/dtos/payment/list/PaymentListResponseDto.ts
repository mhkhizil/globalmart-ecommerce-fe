export type PaymentListResponseDto = {
  payment: PaymentMethodDetail[];
};

export type PaymentMethodDetail = {
  id: number;
  payment_method: string;
  account_no: string;
  account_name: string;
  merchant_id: number;
  status: 'Active';
  type: 'Myanmar' | 'Chinese' | 'International';
  image: string;
  created_at: string;
  updated_at: string;
};
