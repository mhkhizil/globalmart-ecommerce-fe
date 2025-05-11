import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetProductByMerchantIdOptions = Omit<
  UseQueryOptions<ProductListResponseDto, Error>,
  'queryFn'
>;

export const useGetProductByMerchantId = (
  filter: ProductFilterByMerchantDto,
  options?: Partial<GetProductByMerchantIdOptions>
) => {
  return useQuery<ProductListResponseDto, Error>({
    queryKey: ['get-product-by-merchant-id', filter],
    queryFn: async () => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getProductListByMerchantId(filter);
    },
    ...options, // Spread the provided options
  });
};
