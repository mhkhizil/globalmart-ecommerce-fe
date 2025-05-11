import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { CancelOrderByDriverRequestDto } from '@/core/dtos/order/UpdateOrderStatusDto';
import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type CancelOrderByDriverOption = Omit<
  UseMutationOptions<OrderItem, Error, CancelOrderByDriverRequestDto>,
  'mutationFn'
>;

export const useCancelOrderByDriver = (option: CancelOrderByDriverOption) => {
  return useMutation<OrderItem, Error, CancelOrderByDriverRequestDto>({
    mutationKey: ['cancel-order-by-driver'],
    mutationFn: async CancelOrderByDriverData => {
      const service = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await service.cancelOrderByDriver(CancelOrderByDriverData);
    },
    ...option,
  });
};
