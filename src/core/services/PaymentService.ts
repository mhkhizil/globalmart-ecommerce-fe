import { PaymentAddRequestDto } from '../dtos/payment/create/PaymentAddReqeustDto';
import { PaymentAddResponseDto } from '../dtos/payment/create/PaymentAddResponseDto';
import { PaymentListResponseDto } from '../dtos/payment/list/PaymentListResponseDto';
import { RefillWalletResponseDto } from '../dtos/payment/wallet/RefillWalletDto';
import {
  AvailablePaymentListDto,
  TransactionListRequestDto,
  TransactionListResponseDto,
  WalletDto,
} from '../dtos/payment/wallet/WalletDto';
import { IPaymentRepository } from '../interface/repository/IPaymentRepository';
import { IPaymentService } from '../interface/service/IPaymentService';
export class PaymentService implements IPaymentService {
  constructor(private readonly PaymentRepository: IPaymentRepository) {}
  async getPaymentListByMerchantId(
    merchantId: string
  ): Promise<PaymentListResponseDto> {
    return await this.PaymentRepository.getPaymentListByMerchantId<PaymentListResponseDto>(
      merchantId
    );
  }
  async addPayment(
    addPyamentReqeustDto: PaymentAddRequestDto
  ): Promise<PaymentAddResponseDto> {
    return await this.PaymentRepository.addPayment<
      PaymentAddRequestDto,
      PaymentAddResponseDto
    >(addPyamentReqeustDto);
  }
  async addPaymentV2(
    addPyamentReqeustDto: FormData
  ): Promise<PaymentAddResponseDto> {
    return await this.PaymentRepository.addPaymentV2<
      FormData,
      PaymentAddResponseDto
    >(addPyamentReqeustDto);
  }
  async updatePayment(
    id: string,
    addPyamentReqeustDto: PaymentAddRequestDto
  ): Promise<PaymentAddResponseDto> {
    return await this.PaymentRepository.updatePayment<
      PaymentAddRequestDto,
      PaymentAddResponseDto
    >(addPyamentReqeustDto, id);
  }
  async updatePaymentV2(
    id: string,
    addPyamentReqeustDto: FormData
  ): Promise<PaymentAddResponseDto> {
    return await this.PaymentRepository.updatePaymentV2<
      FormData,
      PaymentAddResponseDto
    >(addPyamentReqeustDto, id);
  }

  async getCustomerWallet(userId: string): Promise<WalletDto> {
    return await this.PaymentRepository.getCustomerWallet<WalletDto>(userId);
  }
  async refillWallet(requestDto: FormData): Promise<RefillWalletResponseDto> {
    return await this.PaymentRepository.refillWallet<
      FormData,
      RefillWalletResponseDto
    >(requestDto);
  }
  async getAvailablePaymentList(): Promise<AvailablePaymentListDto> {
    return await this.PaymentRepository.getAvailablePaymentList<AvailablePaymentListDto>();
  }
  async getTransactionList(
    requestDto: TransactionListRequestDto
  ): Promise<TransactionListResponseDto> {
    return await this.PaymentRepository.getTransactionList<
      TransactionListRequestDto,
      TransactionListResponseDto
    >(requestDto);
  }
}
