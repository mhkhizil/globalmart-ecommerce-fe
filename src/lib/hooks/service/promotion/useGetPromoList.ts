import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  PromotionListRequestDto,
  PromotionListResponseDto,
} from '@/core/dtos/promotion/PromotionListResponseDto';
import { PromotionRepository } from '@/core/repository/PromotionRepository';
import { PromotionService } from '@/core/services/PromotionService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetPromoListOptions = Omit<
  UseQueryOptions<PromotionListResponseDto, Error>,
  'queryFn'
>;

export const useGetPromoList = (
  filter: PromotionListRequestDto,
  options?: Partial<GetPromoListOptions>
) => {
  return useQuery<PromotionListResponseDto, Error>({
    queryKey: ['get-promo-list', filter],
    queryFn: async () => {
      const promotionService = new PromotionService(
        new PromotionRepository(new AxiosCustomClient())
      );
      return await promotionService.getPromotionList(filter);
    },
    ...options, // Spread the provided options
  });
};
