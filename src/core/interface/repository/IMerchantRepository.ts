export interface IMerchantRepository {
  register<TRequestDto, TResponseDto>(
    registerDto: TRequestDto
  ): Promise<TResponseDto>;
  registerDriver<TRequestDto, TResponseDto>(
    registerDto: TRequestDto
  ): Promise<TResponseDto>;
  getDriverListByMerchantId<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  assignDriverToOrder<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getWeeklyChartData<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  createDiscount<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getMerchantWithdrawList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
}
