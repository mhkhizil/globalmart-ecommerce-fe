export interface ICategoryRepository {
  getCategoryList<TResponseDto>(): Promise<TResponseDto>;
}
