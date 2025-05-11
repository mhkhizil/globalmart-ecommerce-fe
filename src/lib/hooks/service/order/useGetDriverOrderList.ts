import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  DriverOrderListRequestDto,
  DriverOrderListResponseDto,
} from '@/core/dtos/driver/DriverDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetDriverOrderListOptions = Omit<
  UseQueryOptions<DriverOrderListResponseDto, Error>,
  'queryFn'
>;

export const useGetDriverOrderList = (
  filter: DriverOrderListRequestDto,
  options?: Partial<useGetDriverOrderListOptions>
) => {
  return useQuery<DriverOrderListResponseDto, Error>({
    queryKey: ['get-driver-order-list', filter],
    queryFn: async () => {
      try {
        const orderService = new OrderService(
          new OrderRepository(new AxiosCustomClient())
        );
        const result = await orderService.getDriverOrderList(filter);

        // Handle null/undefined
        if (!result) {
          return { order_items: [] };
        }

        return result;
      } catch {
        return { order_items: [] };
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 30_000,
    retry: 2,
    ...options,
  });
};
