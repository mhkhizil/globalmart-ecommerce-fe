import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { PaymentAddRequestDto } from '@/core/dtos/payment/create/PaymentAddReqeustDto';
import { PaymentAddResponseDto } from '@/core/dtos/payment/create/PaymentAddResponseDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type UpdateMerchantPaymentOptions = Omit<
  UseMutationOptions<
    PaymentAddResponseDto,
    Error,
    { id: string; data: PaymentAddRequestDto }
  >,
  'mutationFn'
>;

type UpdateMerchantPaymentV2Options = Omit<
  UseMutationOptions<
    PaymentAddResponseDto,
    Error,
    { id: string; data: FormData }
  >,
  'mutationFn'
>;

export const useUpdateMerchantPayment = (
  options?: UpdateMerchantPaymentOptions
) => {
  return useMutation<
    PaymentAddResponseDto,
    Error,
    { id: string; data: PaymentAddRequestDto }
  >({
    mutationFn: async paymentData => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.updatePayment(
        paymentData.id,
        paymentData.data
      );
    },
    ...options, // Spread the provided options
  });
};

export const useUpdateMerchantPaymentV2 = (
  options?: UpdateMerchantPaymentV2Options
) => {
  return useMutation<
    PaymentAddResponseDto,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: async paymentData => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.updatePaymentV2(
        paymentData.id,
        paymentData.data
      );
    },
    ...options, // Spread the provided options
  });
};
