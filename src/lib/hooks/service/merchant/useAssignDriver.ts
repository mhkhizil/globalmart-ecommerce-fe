import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { DriverDto } from '@/core/dtos/merchant/DriverDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { ValidationError } from '@/core/repository/UserRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type AssignDriverOption = Omit<
  UseMutationOptions<any, Error | ValidationError, FormData>,
  'mutationFn'
>;

export const useAssignDriver = (option: AssignDriverOption) => {
  return useMutation<any, Error | ValidationError, FormData>({
    mutationKey: ['assign-driver'],
    mutationFn: async (registerDto: FormData) => {
      // Create repository with a client that handles authentication and FormData
      const repository = new MerchantRepository(new AxiosCustomClient());
      const service = new MerchantService(repository);

      try {
        const result = await service.assignDriverToOrder(registerDto);
        return result;
      } catch (error) {
        console.error('Driver registration hook error:', error);
        throw error;
      }
    },
    ...option,
  });
};
