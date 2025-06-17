import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { CouponListResponseDto } from '@/core/dtos/coupon/CouponListResponseDto';
import { CouponRepository } from '@/core/repository/CouponRepository';
import { CouponService } from '@/core/services/CouponService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetCouponListOptions = Omit<
  UseQueryOptions<CouponListResponseDto, Error>,
  'queryFn'
>;

export const useGetCouponList = (options?: Partial<GetCouponListOptions>) => {
  return useQuery<CouponListResponseDto, Error>({
    queryKey: ['get-coupon-list'],
    queryFn: async () => {
      const couponService = new CouponService(
        new CouponRepository(new AxiosCustomClient())
      );
      return await couponService.getCouponList();
    },
    ...options, // Spread the provided options
  });
};
