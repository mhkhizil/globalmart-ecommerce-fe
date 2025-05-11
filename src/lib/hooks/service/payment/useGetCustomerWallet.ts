import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { PaymentListResponseDto } from '@/core/dtos/payment/list/PaymentListResponseDto';
import { WalletDto } from '@/core/dtos/payment/wallet/WalletDto';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetCustomerWalletOptions = Omit<
  UseQueryOptions<WalletDto, Error>,
  'queryFn'
>;

export const useGetCustomerWallet = (
  userId: string,
  options?: Partial<GetCustomerWalletOptions>
) => {
  return useQuery<WalletDto, Error>({
    queryKey: ['get-customer-wallet', userId],
    queryFn: async () => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );
      return await paymentService.getCustomerWallet(userId);
    },
    ...options, // Spread the provided options
  });
};
