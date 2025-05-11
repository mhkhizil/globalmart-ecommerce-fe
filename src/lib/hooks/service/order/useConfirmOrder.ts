import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { ConfirmOrderRequestDto } from '@/core/dtos/order/ConfirmOrderReqeustDto';
import { OrderItem } from '@/core/entity/Order';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { ShopRepository } from '@/core/repository/ShopRepository';
import { AuthService } from '@/core/services/AuthService';
import { OrderService } from '@/core/services/OrderService';
import { ShopService } from '@/core/services/ShopService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type ConfirmOrderOption = Omit<
  UseMutationOptions<OrderItem, Error, ConfirmOrderRequestDto>,
  'mutationFn'
>;

export const useConfirmOrder = (option: ConfirmOrderOption) => {
  return useMutation<OrderItem, Error, ConfirmOrderRequestDto>({
    mutationKey: ['confirm-order'],
    mutationFn: async confirmOrderData => {
      const service = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await service.confirmOrder(confirmOrderData.id);
    },
    ...option,
  });
};
