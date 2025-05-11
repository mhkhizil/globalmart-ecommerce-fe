import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { CategoryListResponseDto } from '@/core/dtos/product/category/CategoryListResponseDto';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { CategoryRepository } from '@/core/repository/CategoryRepository';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { CategoryService } from '@/core/services/CategoryService';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetCategoryListOptions = Omit<
  UseQueryOptions<CategoryListResponseDto, Error>,
  'queryFn'
>;

export const useGetCategoryList = (options?: GetCategoryListOptions) => {
  return useQuery<CategoryListResponseDto, Error>({
    queryKey: ['get-category-list'],
    queryFn: async () => {
      const categoryService = new CategoryService(
        new CategoryRepository(new AxiosCustomClient())
      );
      return await categoryService.getCategoryList();
    },
    ...options, // Spread the provided options
  });
};
