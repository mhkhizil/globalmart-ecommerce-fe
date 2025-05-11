import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { RegisterDto } from '@/core/dtos/auth/register/registerDto';
import { RegisterResponseDto } from '@/core/dtos/auth/register/registerResponseDto';
import {
  UserRepository,
  ValidationError,
} from '@/core/repository/UserRepository';
import { UserService } from '@/core/services/UserService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type RegisterOptions = Omit<
  UseMutationOptions<RegisterResponseDto, Error | ValidationError, RegisterDto>,
  'mutationFn'
>;

export const useRegister = (options?: RegisterOptions) => {
  return useMutation<RegisterResponseDto, Error | ValidationError, RegisterDto>(
    {
      mutationFn: async registerData => {
        const userService = new UserService(
          new UserRepository(new AxiosCustomClient())
        );
        return await userService.register(registerData);
      },
      ...options, // Spread the provided options
    }
  );
};
