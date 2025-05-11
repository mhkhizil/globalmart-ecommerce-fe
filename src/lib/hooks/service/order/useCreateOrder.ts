import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { CreateOrderRequestDto } from '@/core/dtos/order/CreateOrderReqeustDto';
import { AuthRepository } from '@/core/repository/AuthRepository';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { ShopRepository } from '@/core/repository/ShopRepository';
import { AuthService } from '@/core/services/AuthService';
import { OrderService } from '@/core/services/OrderService';
import { ShopService } from '@/core/services/ShopService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type CreateOrderOption = Omit<
  UseMutationOptions<any, Error, CreateOrderRequestDto>,
  'mutationFn'
>;

export const useCreateOrder = (option: CreateOrderOption) => {
  return useMutation<any, Error, CreateOrderRequestDto>({
    mutationKey: ['create-order'],
    mutationFn: async createOrderData => {
      const service = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await service.createOrder(createOrderData);
    },
    ...option,
  });
};
