import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  MerchantWithdrawData,
  MerchantWithdrawRequestDto,
} from '@/core/dtos/merchant/MerchantWithdrawDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetMerchantWithdrawHistoryOptions = Omit<
  UseQueryOptions<MerchantWithdrawData[], Error>,
  'queryFn'
>;

export const useGetMerchantWithdrawHistory = (
  requestDto: MerchantWithdrawRequestDto,
  options?: Partial<GetMerchantWithdrawHistoryOptions>
) => {
  return useQuery<MerchantWithdrawData[], Error>({
    queryKey: ['get-merchant-withdraw-history'],
    queryFn: async () => {
      const merchantService = new MerchantService(
        new MerchantRepository(new AxiosCustomClient())
      );
      return await merchantService.getMerchantWithdrawList(requestDto);
    },
    ...options,
  });
};
