export interface MerchantWithdrawRequestDto {
  merchant_id: number;
}

export interface MerchantWithdrawData {
  id: number;
  merchant_id: number;
  payment_id: number;
  actual_wallet: string;
  completed_wallet: string;
  withdraw_amount: string;
  remark: string;
  created_at: string;
  updated_at: string;
  merchant_withdraw_image: [
    {
      id: number;
      merchant_withdraw_id: number;
      image: string;
      created_at: string;
      updated_at: string;
    },
    {
      id: number;
      merchant_withdraw_id: number;
      image: string;
      created_at: string;
      updated_at: string;
    },
  ];
}
