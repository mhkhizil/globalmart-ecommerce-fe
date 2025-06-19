import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { ApplyCouponRequestDto } from '@/core/dtos/coupon/ApplyCouponRequestDto';
import { ApplyCouponResponseDto } from '@/core/dtos/coupon/ApplyCouponResponseDto';
import { CouponRepository } from '@/core/repository/CouponRepository';
import { CouponService } from '@/core/services/CouponService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type ApplyCouponOptions = Omit<
  UseMutationOptions<ApplyCouponResponseDto, Error, ApplyCouponRequestDto>,
  'mutationFn'
>;

export const useApplyCoupon = (options?: ApplyCouponOptions) => {
  return useMutation<ApplyCouponResponseDto, Error, ApplyCouponRequestDto>({
    mutationKey: ['apply-coupon'],
    mutationFn: async applyCouponData => {
      const couponService = new CouponService(
        new CouponRepository(new AxiosCustomClient())
      );
      return await couponService.applyCoupon(applyCouponData);
    },
    ...options, // Spread the provided options
  });
};
