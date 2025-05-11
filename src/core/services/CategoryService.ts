import { CategoryListResponseDto } from '../dtos/product/category/CategoryListResponseDto';
import { ICategoryRepository } from '../interface/repository/ICategoryRepository';
import { ICategoryService } from '../interface/service/ICategoryService';

export class CategoryService implements ICategoryService {
  constructor(private readonly CommonRepository: ICategoryRepository) {}
  async getCategoryList(): Promise<CategoryListResponseDto> {
    const response =
      await this.CommonRepository.getCategoryList<CategoryListResponseDto>();

    return response;
  }
}
