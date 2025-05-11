import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  WeeklyChartDataRequestDto,
  WeeklyChartDataResponseDto,
} from '@/core/dtos/merchant/WeeklyChartDataResponseDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetWeeklyChartDataOptions = Omit<
  UseQueryOptions<WeeklyChartDataResponseDto, Error>,
  'queryFn'
>;

export const useGetWeeklyChartData = (
  requestDto: WeeklyChartDataRequestDto,
  options?: Partial<GetWeeklyChartDataOptions>
) => {
  return useQuery<WeeklyChartDataResponseDto, Error>({
    queryKey: ['get-weekly-chart-data'],
    queryFn: async () => {
      const merchantService = new MerchantService(
        new MerchantRepository(new AxiosCustomClient())
      );
      return await merchantService.getWeeklyChartData(requestDto);
    },
    ...options,
  });
};
