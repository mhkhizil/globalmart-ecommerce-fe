import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { LoginRequestDto } from '@/core/dtos/auth/login/loginRequestDto';
import { LoginResponseDto } from '@/core/dtos/auth/login/loginResponseDto';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { AuthService } from '@/core/services/AuthService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type LoginOption = Omit<
  UseMutationOptions<LoginResponseDto, Error, LoginRequestDto>,
  'mutationFn'
>;

export const useLogin = (option: LoginOption) => {
  return useMutation<LoginResponseDto, Error, LoginRequestDto>({
    mutationKey: ['login'],
    mutationFn: async loginData => {
      const service = new AuthService(
        new AuthRepository(new AxiosCustomClient())
      );
      return await service.login(loginData);
    },
    ...option,
  });
};
