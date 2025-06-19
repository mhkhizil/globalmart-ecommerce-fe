export interface ICommonRepository {
  getShopList<TResponseDto>(): Promise<TResponseDto>;
  getContactInfo<TResponseDto>(): Promise<TResponseDto>;
  getEventList<TResponseDto>(): Promise<TResponseDto>;
  getEventDetail<TResponseDto>(id: number): Promise<TResponseDto>;
  getAllCurrency<TResponseDto>(): Promise<TResponseDto>;
  getCurrencyByCurrencyCode<TResponseDto>(
    currencyCode: string
  ): Promise<TResponseDto>;
}
