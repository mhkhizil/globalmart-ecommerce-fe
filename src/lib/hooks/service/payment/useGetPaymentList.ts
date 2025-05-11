import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { PaymentListResponseDto } from '@/core/dtos/payment/list/PaymentListResponseDto';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetPaymentListByMerchantIdOptions = Omit<
  UseQueryOptions<PaymentListResponseDto, Error>,
  'queryFn'
>;

export const useGetPaymentListByMerchantId = (
  merchantId: string,
  options?: Partial<GetPaymentListByMerchantIdOptions>
) => {
  return useQuery<PaymentListResponseDto, Error>({
    queryKey: ['get-payment-by-merchantid', merchantId],
    queryFn: async () => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.getPaymentListByMerchantId(merchantId);
    },
    ...options, // Spread the provided options
  });
};
