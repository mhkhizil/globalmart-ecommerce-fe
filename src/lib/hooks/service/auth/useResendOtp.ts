import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  ResendOtpRequestDto,
  ResendOtpResponseDto,
} from '@/core/dtos/auth/otp/Otp';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { AuthService } from '@/core/services/AuthService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type ResendOtpOption = Omit<
  UseMutationOptions<ResendOtpResponseDto, Error, ResendOtpRequestDto>,
  'mutationFn'
>;

export const useResendOtp = (option: ResendOtpOption) => {
  return useMutation<ResendOtpResponseDto, Error, ResendOtpRequestDto>({
    mutationKey: ['resendOtp'],
    mutationFn: async resendOtpData => {
      const service = new AuthService(
        new AuthRepository(new AxiosCustomClient())
      );
      return await service.resendOtp(resendOtpData);
    },
    ...option,
  });
};
