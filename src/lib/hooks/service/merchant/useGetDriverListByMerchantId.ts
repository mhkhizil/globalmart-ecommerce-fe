import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  DriverListResponseDto,
  GetDriverListByMerchantIdRequestDto,
} from '@/core/dtos/merchant/DriverDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetDriverListByMerchantIdOptions = Omit<
  UseQueryOptions<DriverListResponseDto, Error>,
  'queryFn'
>;

export const useGetDriverListByMerchantId = (
  requestDto: GetDriverListByMerchantIdRequestDto,
  options?: Partial<GetDriverListByMerchantIdOptions>
) => {
  return useQuery<DriverListResponseDto, Error>({
    queryKey: ['get-driver-list-by-merchant-id'],
    queryFn: async () => {
      const merchantService = new MerchantService(
        new MerchantRepository(new AxiosCustomClient())
      );
      return await merchantService.getDriverListByMerchantId(requestDto);
    },
    ...options,
  });
};
