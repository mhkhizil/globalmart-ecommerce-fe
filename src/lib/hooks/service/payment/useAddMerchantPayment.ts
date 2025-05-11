import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { PaymentAddRequestDto } from '@/core/dtos/payment/create/PaymentAddReqeustDto';
import { PaymentAddResponseDto } from '@/core/dtos/payment/create/PaymentAddResponseDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type AddMerchantPaymentOptions = Omit<
  UseMutationOptions<PaymentAddResponseDto, Error, PaymentAddRequestDto>,
  'mutationFn'
>;
type AddMerchantPaymentV2Options = Omit<
  UseMutationOptions<PaymentAddResponseDto, Error, FormData>,
  'mutationFn'
>;

export const useAddMerchantPayment = (options?: AddMerchantPaymentOptions) => {
  return useMutation<PaymentAddResponseDto, Error, PaymentAddRequestDto>({
    mutationFn: async paymentData => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.addPayment(paymentData);
    },
    ...options, // Spread the provided options
  });
};

export const useAddMerchantPaymentV2 = (
  options?: AddMerchantPaymentV2Options
) => {
  return useMutation<PaymentAddResponseDto, Error, FormData>({
    mutationFn: async paymentData => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.addPaymentV2(paymentData);
    },
    ...options, // Spread the provided options
  });
};
