import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductDetailByMerchantRequestDto } from '@/core/dtos/product/ProductDetailByMerchantRequestDto';
import { ProductDetailByMerchantResponseDto } from '@/core/dtos/product/ProductDetailByMerchantResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetProductDetailByMerchantOptions = Omit<
  UseQueryOptions<ProductDetailByMerchantResponseDto, Error>,
  'queryFn'
>;

export const useGetProductDetailByMerchant = (
  filter: ProductDetailByMerchantRequestDto,
  options?: Partial<GetProductDetailByMerchantOptions>
) => {
  return useQuery<ProductDetailByMerchantResponseDto, Error>({
    queryKey: ['get-product-detail-by-merchant', filter],
    queryFn: async () => {
      const productService = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await productService.getProductDetailByMerchant(filter);
    },
    ...options, // Spread the provided options
  });
};
