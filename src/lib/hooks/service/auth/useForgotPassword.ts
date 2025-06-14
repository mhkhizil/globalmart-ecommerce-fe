import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
} from '@/core/dtos/auth/forgot-password/ForgotPassword';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { AuthService } from '@/core/services/AuthService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type ForgotPasswordOption = Omit<
  UseMutationOptions<
    ForgotPasswordResponseDto,
    Error,
    ForgotPasswordRequestDto
  >,
  'mutationFn'
>;

export const useForgotPassword = (option: ForgotPasswordOption) => {
  return useMutation<
    ForgotPasswordResponseDto,
    Error,
    ForgotPasswordRequestDto
  >({
    mutationKey: ['forgotPassword'],
    mutationFn: async forgotPasswordData => {
      const service = new AuthService(
        new AuthRepository(new AxiosCustomClient())
      );
      return await service.forgotPassword(forgotPasswordData);
    },
    ...option,
  });
};
