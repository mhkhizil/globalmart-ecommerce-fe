import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { OtpRequestDto, OtpResponseDto } from '@/core/dtos/auth/otp/Otp';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { AuthService } from '@/core/services/AuthService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type VerifyOtpOption = Omit<
  UseMutationOptions<OtpResponseDto, Error, OtpRequestDto>,
  'mutationFn'
>;

export const useVerifyOtp = (option: VerifyOtpOption) => {
  return useMutation<OtpResponseDto, Error, OtpRequestDto>({
    mutationKey: ['verifyOtp'],
    mutationFn: async verifyOtpData => {
      const service = new AuthService(
        new AuthRepository(new AxiosCustomClient())
      );
      return await service.verifyOtp(verifyOtpData);
    },
    ...option,
  });
};
