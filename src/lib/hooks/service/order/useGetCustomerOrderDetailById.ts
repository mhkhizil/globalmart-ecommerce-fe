import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { OrderFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { OrderListResponseDto } from '@/core/dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '@/core/dtos/order/OrderNotificationListresponseDto';
import { Order } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetCustomerOrderDetailOptions = Omit<
  UseQueryOptions<Order, Error>,
  'queryFn'
>;

export const useGetCustomerOrderDetail = (
  id: string,
  options?: Partial<useGetCustomerOrderDetailOptions>
) => {
  return useQuery<Order, Error>({
    queryKey: ['get-customer-order-detail-by-id', id],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getOrderById(id);
    },
    ...options, // Spread the provided options
  });
};
