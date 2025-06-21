import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { ProductFilterByCategoryDto } from '@/core/dtos/product/ProductFilterByCategoryDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

export const useGetTrendingProductListInfinite = (
  filter: Omit<ProductFilterByCategoryDto, 'page'>,
  options?: Omit<
    UseInfiniteQueryOptions<ProductListResponseDto>,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
) => {
  return useInfiniteQuery({
    queryKey: ['get-product-trending-list-infinite', filter],
    queryFn: async ({ pageParam: pageParameter = 1 }) => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getTrendingProductList({
        ...filter,
        page: pageParameter as number,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more products to load
      if (lastPage?.products && lastPage.products.length === filter.per_page) {
        return allPages.length + 1;
      }
      return;
    },
    initialPageParam: 1,
    ...options,
  });
};
