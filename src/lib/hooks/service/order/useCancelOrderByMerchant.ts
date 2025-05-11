import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type CancelOrderByMerchantOption = Omit<
  UseMutationOptions<OrderItem, Error, string>,
  'mutationFn'
>;

export const useCancelOrderByMerchant = (
  option: CancelOrderByMerchantOption
) => {
  return useMutation<OrderItem, Error, string>({
    mutationKey: ['cancel-order-by-merchant'],
    mutationFn: async CancelOrderByMerchantData => {
      const service = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await service.cancelOrderByMerchant(CancelOrderByMerchantData);
    },
    ...option,
  });
};
