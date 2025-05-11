export type PaymentAddRequestDto = {
  merchant_id: number;
  payment_method: string;
  account_no: string;
  account_name: string;
  status: string;
};
