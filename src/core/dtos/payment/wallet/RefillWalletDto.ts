import { WalletDto } from './WalletDto';

// export interface RefillWalletRequestDto {
//   amount: number;
//   payment_method: string;
//   account_number: string;
//   account_id: string;
//   transaction_id: string;
//   remark: string;
// }

export interface RefillWalletResponseDto {
  status: string;
  message: string;
  data: WalletDto;
}
