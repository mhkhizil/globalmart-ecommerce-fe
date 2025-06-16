import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByCategoryDto } from '@/core/dtos/product/ProductFilterByCategoryDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetDealOfTheDayOptions = Omit<
  UseQueryOptions<ProductListResponseDto, Error>,
  'queryFn'
>;

export const useGetDealOfTheDay = (
  filter: ProductFilterByCategoryDto,
  options?: Partial<GetDealOfTheDayOptions>
) => {
  return useQuery<ProductListResponseDto, Error>({
    queryKey: ['get-product-deal-of-the-day', filter],
    queryFn: async () => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getDealOfTheDay(filter);
    },
    ...options, // Spread the provided options
  });
};
