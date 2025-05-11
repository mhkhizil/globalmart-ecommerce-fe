export interface ICommonRepository {
  getShopList<TResponseDto>(): Promise<TResponseDto>;
  getContactInfo<TResponseDto>(): Promise<TResponseDto>;
  getEventList<TResponseDto>(): Promise<TResponseDto>;
  getEventDetail<TResponseDto>(id: number): Promise<TResponseDto>;
}
