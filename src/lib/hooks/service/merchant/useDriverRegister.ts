import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { DriverDto } from '@/core/dtos/merchant/DriverDto';
import { MerchantRepository } from '@/core/repository/MerchantRepository';
import { ValidationError } from '@/core/repository/UserRepository';
import { MerchantService } from '@/core/services/MerchantService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type DriverRegisterOption = Omit<
  UseMutationOptions<DriverDto, Error | ValidationError, FormData>,
  'mutationFn'
>;

export const useDriverRegister = (option: DriverRegisterOption) => {
  return useMutation<DriverDto, Error | ValidationError, FormData>({
    mutationKey: ['register-driver'],
    mutationFn: async (registerDto: FormData) => {
      console.log('useDriverRegister - Starting mutation');

      // Make sure FormData is valid by logging key items
      if (registerDto) {
        console.log('FormData contains name:', registerDto.get('name'));
        console.log('FormData contains email:', registerDto.get('email'));
        console.log(
          'FormData contains image:',
          registerDto.has('image') ? 'Yes' : 'No'
        );
      }

      // Create repository with a client that handles authentication and FormData
      const repository = new MerchantRepository(new AxiosCustomClient());
      const service = new MerchantService(repository);

      try {
        const result = await service.registerDriver(registerDto);
        console.log('Driver registration successful');
        return result;
      } catch (error) {
        console.error('Driver registration hook error:', error);
        throw error;
      }
    },
    ...option,
  });
};
