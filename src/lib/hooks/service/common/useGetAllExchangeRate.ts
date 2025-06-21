import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  CurrencyRequestDto,
  GetAllCurrencyResponseDto,
} from '@/core/dtos/currency/CurrencyDto';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetAllExchangeRateOptions = Omit<
  UseQueryOptions<
    GetAllCurrencyResponseDto,
    Error,
    GetAllCurrencyResponseDto,
    readonly unknown[]
  >,
  'queryFn'
>;

export const useGetAllExchangeRate = (
  options?: Partial<GetAllExchangeRateOptions>
) => {
  return useQuery<GetAllCurrencyResponseDto, Error>({
    queryKey: ['get-all-exchange-rate'],
    queryFn: async () => {
      const commonService = new CommonService(
        new CommonRepository(new AxiosCustomClient())
      );
      return await commonService.getAllCurrency();
    },
    ...options, // Spread the provided options
  });
};
