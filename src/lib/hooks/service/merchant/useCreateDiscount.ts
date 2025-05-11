import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  CreateDiscountRequestDto,
  CreateDiscountResponseDto,
} from '@/core/dtos/discount/DiscountDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { ValidationError } from '@/core/repository/UserRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type CreateDiscountOptions = Omit<
  UseMutationOptions<
    CreateDiscountResponseDto,
    Error | ValidationError,
    CreateDiscountRequestDto
  >,
  'mutationFn'
>;

export const useCreateDiscount = (options?: CreateDiscountOptions) => {
  return useMutation<
    CreateDiscountResponseDto,
    Error | ValidationError,
    CreateDiscountRequestDto
  >({
    mutationFn: async createDiscountData => {
      const merchantService = new MerchantService(
        new MerchantRepository(new AxiosCustomClient())
      );
      return await merchantService.createDiscount(createDiscountData);
    },
    ...options, // Spread the provided options
  });
};
