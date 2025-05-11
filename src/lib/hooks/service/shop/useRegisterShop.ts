import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { RegisterShopRequestDto } from '@/core/dtos/shop/shop-register/RegisterShopRequestDto';
import { RegisterShopResponseDto } from '@/core/dtos/shop/shop-register/RegisterShopResponseDto';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { ShopRepository } from '@/core/repository/ShopRepository';
import { AuthService } from '@/core/services/AuthService';
import { ShopService } from '@/core/services/ShopService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type RegisterShopOption = Omit<
  UseMutationOptions<RegisterShopResponseDto, Error, RegisterShopRequestDto>,
  'mutationFn'
>;

export const useRegisterShop = (option: RegisterShopOption) => {
  return useMutation<RegisterShopResponseDto, Error, RegisterShopRequestDto>({
    mutationKey: ['register-shop'],
    mutationFn: async RegisterShopData => {
      const service = new ShopService(
        new ShopRepository(new AxiosCustomClient())
      );
      return await service.registerShop(RegisterShopData.formData);
    },
    ...option,
  });
};
