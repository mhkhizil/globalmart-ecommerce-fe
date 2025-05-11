export interface WalletDto {
  wallet_amount: string;
  account_number: string;
  account_name: string;
  payment_method: string;
}

export interface AvailablePaymentListDto {
  payment: Array<{
    id: number;
    payment_method: string;
    account_no: string;
    account_name: string;
    merchant_id: number;
    status: string;
    created_at: string;
    updated_at: string;
    type: string;
    image: string;
  }>;
}

export interface TransactionListResponseDto {
  transactions: Array<{
    id: number;
    payment_id: number;
    user_id: number;
    wallet_amount: string;
    remark: string;
    image: string;
    status: number;
    created_at: string;
    updated_at: string;
    account_no: string;
    account_name: string;
  }>;
}

export interface TransactionListRequestDto {
  page: number;
  per_page: number;
}
