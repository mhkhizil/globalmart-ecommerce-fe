import { PaymentAddRequestDto } from '@/core/dtos/payment/create/PaymentAddReqeustDto';
import { PaymentAddResponseDto } from '@/core/dtos/payment/create/PaymentAddResponseDto';
import { PaymentListResponseDto } from '@/core/dtos/payment/list/PaymentListResponseDto';
import { RefillWalletResponseDto } from '@/core/dtos/payment/wallet/RefillWalletDto';
import {
  AvailablePaymentListDto,
  TransactionListRequestDto,
  TransactionListResponseDto,
  WalletDto,
} from '@/core/dtos/payment/wallet/WalletDto';
export interface IPaymentService {
  addPayment(
    addPyamentReqeustDto: PaymentAddRequestDto
  ): Promise<PaymentAddResponseDto>;
  addPaymentV2(addPyamentReqeustDto: FormData): Promise<PaymentAddResponseDto>;
  updatePayment(
    id: string,
    addPyamentReqeustDto: PaymentAddRequestDto
  ): Promise<PaymentAddResponseDto>;
  updatePaymentV2(
    id: string,
    addPyamentReqeustDto: FormData
  ): Promise<PaymentAddResponseDto>;
  getPaymentListByMerchantId(
    merchantId: string
  ): Promise<PaymentListResponseDto>;
  getCustomerWallet(userId: string): Promise<WalletDto>;
  refillWallet(requestDto: FormData): Promise<RefillWalletResponseDto>;
  getAvailablePaymentList(): Promise<AvailablePaymentListDto>;
  getTransactionList(
    requestDto: TransactionListRequestDto
  ): Promise<TransactionListResponseDto>;
}
