import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@/core/dtos/auth/reset-password/ResetPasswordDto';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { AuthService } from '@/core/services/AuthService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type ResetPasswordOption = Omit<
  UseMutationOptions<ResetPasswordResponseDto, Error, ResetPasswordRequestDto>,
  'mutationFn'
>;

export const useResetPassword = (option: ResetPasswordOption) => {
  return useMutation<ResetPasswordResponseDto, Error, ResetPasswordRequestDto>({
    mutationKey: ['resetPassword'],
    mutationFn: async resetPasswordData => {
      const service = new AuthService(
        new AuthRepository(new AxiosCustomClient())
      );
      return await service.resetPassword(resetPasswordData);
    },
    ...option,
  });
};
