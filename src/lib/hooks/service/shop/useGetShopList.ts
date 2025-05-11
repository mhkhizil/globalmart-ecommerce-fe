import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { GetMerchantShopListRequestDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListRequestDto';
import { GetMerchantShopListResponseDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListResponseDto';
import { ShopListResponseDto } from '@/core/dtos/shop/ShopResponseDto';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ShopRepository } from '@/core/repository/ShopRepository';
import { CommonService } from '@/core/services/CommonService';
import { ProductService } from '@/core/services/ProductService';
import { ShopService } from '@/core/services/ShopService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetShopListByIdOptions = Omit<
  UseQueryOptions<ShopListResponseDto, Error>,
  'queryFn'
>;

export const useGetShopTypeList = (
  options?: Partial<useGetShopListByIdOptions>
) => {
  return useQuery<ShopListResponseDto, Error>({
    queryKey: ['get-product-by-merchant-id'],
    queryFn: async () => {
      const commonService = new CommonService(
        new CommonRepository(new AxiosCustomClient())
      );
      return await commonService.getShopList();
    },
    ...options, // Spread the provided options
  });
};
