export interface IPromotionRepository {
  getPromotionList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
}
