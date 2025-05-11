import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { UpdateOrderStatusRequestDto } from '@/core/dtos/order/ConfirmOrderReqeustDto';
import { UpdateDeliveryStatusDto } from '@/core/dtos/order/UpdateOrderStatusDto';
import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type UpdateDeliveryStatusOption = Omit<
  UseMutationOptions<OrderItem, Error, UpdateDeliveryStatusDto>,
  'mutationFn'
>;

export const useUpdateDeliveryStatus = (option: UpdateDeliveryStatusOption) => {
  return useMutation<OrderItem, Error, UpdateDeliveryStatusDto>({
    mutationKey: ['update-delivery-status'],
    mutationFn: async UpdateDeliveryStatusData => {
      const service = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await service.updateDeliveryStatus(UpdateDeliveryStatusData);
    },
    ...option,
  });
};
