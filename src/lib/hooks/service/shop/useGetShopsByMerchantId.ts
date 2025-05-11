import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { GetMerchantShopListRequestDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListRequestDto';
import { GetMerchantShopListResponseDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListResponseDto';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ShopRepository } from '@/core/repository/ShopRepository';
import { ProductService } from '@/core/services/ProductService';
import { ShopService } from '@/core/services/ShopService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetShopListByMerchantIdOptions = Omit<
  UseQueryOptions<GetMerchantShopListResponseDto, Error>,
  'queryFn'
>;

export const useGetShopListByMerchantId = (
  filter: GetMerchantShopListRequestDto,
  options?: Partial<GetShopListByMerchantIdOptions>
) => {
  return useQuery<GetMerchantShopListResponseDto, Error>({
    queryKey: ['get-product-by-merchant-id', filter],
    queryFn: async () => {
      const shopService = new ShopService(
        new ShopRepository(new AxiosCustomClient())
      );
      return await shopService.getMerchantShopList(filter);
    },
    ...options, // Spread the provided options
  });
};
