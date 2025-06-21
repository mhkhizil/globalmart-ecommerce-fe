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

type GetDealOfTheDayListInfiniteOptions = Omit<
  UseInfiniteQueryOptions<
    ProductListResponseDto,
    Error,
    InfiniteData<ProductListResponseDto>,
    readonly unknown[],
    number
  >,
  'queryFn' | 'getNextPageParam' | 'initialPageParam'
>;

export const useGetDealOfTheDayListInfinite = (
  filter: Omit<ProductFilterByCategoryDto, 'page'>,
  options?: Partial<GetDealOfTheDayListInfiniteOptions>
) => {
  return useInfiniteQuery({
    queryKey: ['get-product-deal-of-the-day-list-infinite', filter],
    queryFn: async ({ pageParam: pageParameter = 1 }) => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getDealOfTheDay({
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
