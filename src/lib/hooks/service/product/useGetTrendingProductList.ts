import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByCategoryDto } from '@/core/dtos/product/ProductFilterByCategoryDto';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetTrendingProductListOptions = Omit<
  UseQueryOptions<ProductListResponseDto, Error>,
  'queryFn'
>;

export const useGetTrendingProductList = (
  filter: ProductFilterByCategoryDto,
  options?: Partial<GetTrendingProductListOptions>
) => {
  return useQuery<ProductListResponseDto, Error>({
    queryKey: ['get-product-trending-list', filter],
    queryFn: async () => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getTrendingProductList(filter);
    },
    ...options, // Spread the provided options
  });
};
