import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByCategoryDto } from '@/core/dtos/product/ProductFilterByCategoryDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetNewArrivalProductOptions = Omit<
  UseQueryOptions<ProductListResponseDto, Error>,
  'queryFn'
>;

export const useGetNewArrivalProduct = (
  filter: ProductFilterByCategoryDto,
  options?: Partial<GetNewArrivalProductOptions>
) => {
  return useQuery<ProductListResponseDto, Error>({
    queryKey: ['get-product-new-arrival-list', filter],
    queryFn: async () => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getNewArrival(filter);
    },
    ...options, // Spread the provided options
  });
};
