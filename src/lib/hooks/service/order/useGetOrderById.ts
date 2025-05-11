import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { MerchantOrderDetailDto } from '@/core/dtos/order/OrderFilterDto';
import { OrderListResponseDto } from '@/core/dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '@/core/dtos/order/OrderNotificationListresponseDto';
import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetOrderByIdOptions = Omit<
  UseQueryOptions<OrderItem, Error>,
  'queryFn'
>;

export const useGetOrderById = (
  request: MerchantOrderDetailDto,
  options?: Partial<useGetOrderByIdOptions>
) => {
  return useQuery<OrderItem, Error>({
    queryKey: ['get-orderitem-by-id', request.order_id],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getOrderItemById(request);
    },
    ...options, // Spread the provided options
  });
};
