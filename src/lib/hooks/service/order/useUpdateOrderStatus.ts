import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { UpdateOrderStatusRequestDto } from '@/core/dtos/order/ConfirmOrderReqeustDto';
import { UpdateOrderStatusDto } from '@/core/dtos/order/UpdateOrderStatusDto';
import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type UpdateOrderStatusOption = Omit<
  UseMutationOptions<
    OrderItem,
    Error,
    {
      params: UpdateOrderStatusDto;
      updateOrderStatusData: UpdateOrderStatusRequestDto;
    }
  >,
  'mutationFn'
>;

export const useUpdateOrderStatus = (option: UpdateOrderStatusOption) => {
  return useMutation<
    OrderItem,
    Error,
    {
      params: UpdateOrderStatusDto;
      updateOrderStatusData: UpdateOrderStatusRequestDto;
    }
  >({
    mutationKey: ['update-order-status'],
    mutationFn: async UpdateOrderStatusData => {
      const service = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await service.updateOrderStatus(
        UpdateOrderStatusData.params,
        UpdateOrderStatusData.updateOrderStatusData
      );
    },
    ...option,
  });
};
