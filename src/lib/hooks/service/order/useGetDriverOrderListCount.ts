import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  DriverOrderListCountFilterDto,
  OrderCountFilterDto,
} from '@/core/dtos/order/OrderFilterDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetDriverOrderListCountOptions = Omit<
  UseQueryOptions<number, Error>,
  'queryFn'
>;

export const useGetDriverOrderListCount = (
  filter: DriverOrderListCountFilterDto,
  options?: Partial<useGetDriverOrderListCountOptions>
) => {
  return useQuery<number, Error>({
    queryKey: ['get-order-list-count', filter],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getDriverOrderListCount(filter);
    },
    ...options, // Spread the provided options
  });
};
