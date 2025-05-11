import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { OrderCountFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetOrderListCountOptions = Omit<
  UseQueryOptions<number, Error>,
  'queryFn'
>;

export const useGetOrderListCount = (
  filter: OrderCountFilterDto,
  options?: Partial<useGetOrderListCountOptions>
) => {
  return useQuery<number, Error>({
    queryKey: ['get-order-list-count', filter],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getOrderListCount(filter);
    },
    ...options, // Spread the provided options
  });
};
