export interface IShopRepository {
  registerShop<TRequestDto, TResponseDto>(
    reqeustData: TRequestDto
  ): Promise<TResponseDto>;

  getMerchantShopList<TRequestDto, TResponseDto>(
    reqeustData: TRequestDto
  ): Promise<TResponseDto>;

  getShopDetail<TResponseDto>(reqeustData: string): Promise<TResponseDto>;
}
