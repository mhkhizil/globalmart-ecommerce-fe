import { CategoryListResponseDto } from '@/core/dtos/product/category/CategoryListResponseDto';

export interface ICategoryService {
  getCategoryList(): Promise<CategoryListResponseDto>;
}
