import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { AvailablePaymentListDto } from '@/core/dtos/payment/wallet/WalletDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetAvailablePaymentListOptions = Omit<
  UseQueryOptions<AvailablePaymentListDto, Error>,
  'queryFn'
>;

export const useGetAvailablePaymentList = (
  options?: Partial<GetAvailablePaymentListOptions>
) => {
  return useQuery<AvailablePaymentListDto, Error>({
    queryKey: ['get-available-payment-list'],
    queryFn: async () => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.getAvailablePaymentList();
    },
    ...options,
  });
};
