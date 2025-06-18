export interface IProductRepository {
  getProductListByCategory<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getAllProduct<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getProductById<TResponseDto>(id: string): Promise<TResponseDto>;
  getProductListByMerchantId<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  createProduct<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getTrendingProductList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  getProductDetailByMerchant<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
}
