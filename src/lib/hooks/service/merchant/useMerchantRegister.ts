import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { MerchantRegisterRequestDto } from '@/core/dtos/merchant/MerchantRegisterRequestDto';
import { MerchantRegisterResponseDto } from '@/core/dtos/merchant/MerchantRegisterResponseDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { ValidationError } from '@/core/repository/UserRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type RegisterOptions = Omit<
  UseMutationOptions<
    MerchantRegisterResponseDto,
    Error | ValidationError,
    MerchantRegisterRequestDto
  >,
  'mutationFn'
>;

export const useMerchantRegister = (options?: RegisterOptions) => {
  return useMutation<
    MerchantRegisterResponseDto,
    Error | ValidationError,
    MerchantRegisterRequestDto
  >({
    mutationFn: async registerData => {
      const userService = new MerchantService(
        new MerchantRepository(new AxiosCustomClient())
      );
      return await userService.register(registerData);
    },
    ...options, // Spread the provided options
  });
};
