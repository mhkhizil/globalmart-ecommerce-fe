import { UseQueryOptions } from '@tanstack/react-query';

import { GetMerchantShopListResponseDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListResponseDto';

import { useGetShopListByMerchantId } from './useGetShopsByMerchantId';

type GetAllShopsOptions = Omit<
  UseQueryOptions<GetMerchantShopListResponseDto, Error>,
  'queryFn'
>;

/**
 * Custom hook to fetch all shops without filtering by merchant_id
 * This hook wraps useGetShopListByMerchantId with empty filter
 */
export const useGetAllShops = (options?: Partial<GetAllShopsOptions>) => {
  // Pass an empty object as filter to get all shops
  return useGetShopListByMerchantId(
    {},
    {
      // Set better cache key for this specific use case
      ...options,
      queryKey: ['get-all-shops'],
    }
  );
};
