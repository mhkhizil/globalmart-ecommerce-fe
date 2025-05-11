import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByCategoryDto } from '@/core/dtos/product/ProductFilterByCategoryDto';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetProductByCategoryOptions = Omit<
  UseQueryOptions<ProductListResponseDto, Error>,
  'queryFn'
>;

export const useGetProductByCategory = (
  filter: ProductFilterByCategoryDto,
  options?: Partial<GetProductByCategoryOptions>
) => {
  return useQuery<ProductListResponseDto, Error>({
    queryKey: ['get-product-by-category', filter],
    queryFn: async () => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getProductListByCateogry(filter);
    },
    ...options, // Spread the provided options
  });
};
