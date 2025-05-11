import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { RefillWalletResponseDto } from '@/core/dtos/payment/wallet/RefillWalletDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type RefillWalletOption = Omit<
  UseMutationOptions<RefillWalletResponseDto, Error, FormData>,
  'mutationFn'
>;

export const useRefillWallet = (option: RefillWalletOption) => {
  return useMutation<RefillWalletResponseDto, Error, FormData>({
    mutationKey: ['refill-wallet'],
    mutationFn: async RefillWalletData => {
      const service = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await service.refillWallet(RefillWalletData);
    },
    ...option,
  });
};
