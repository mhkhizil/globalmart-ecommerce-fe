export interface IPaymentRepository {
  addPayment<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  addPaymentV2<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  updatePayment<TRequestDto, TResponseDto>(
    requestDto: TRequestDto,
    id: string
  ): Promise<TResponseDto>;
  updatePaymentV2<TRequestDto, TResponseDto>(
    requestDto: TRequestDto,
    id: string
  ): Promise<TResponseDto>;
  getPaymentListByMerchantId<TResponseDto>(
    merchantId: string
  ): Promise<TResponseDto>;
  getCustomerWallet<TResponseDto>(userId: string): Promise<TResponseDto>;
  refillWallet<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getAvailablePaymentList<TResponseDto>(): Promise<TResponseDto>;
  getTransactionList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
}
