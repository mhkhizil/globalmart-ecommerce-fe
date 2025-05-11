import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { OrderFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { OrderListResponseDto } from '@/core/dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '@/core/dtos/order/OrderNotificationListresponseDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetNotifyOrderListOptions = Omit<
  UseQueryOptions<OrderNotificationListResponseDto, Error>,
  'queryFn'
>;

export const useGetNotifyOrderList = (
  filter: OrderFilterDto,
  options?: Partial<useGetNotifyOrderListOptions>
) => {
  return useQuery<OrderNotificationListResponseDto, Error>({
    queryKey: ['get-product-by-merchant-id', filter],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getMerchantOrderNotificationList(filter);
    },
    ...options, // Spread the provided options
  });
};
