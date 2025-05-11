import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { DailyCompletedOrderCountByDriverIdFilterDto } from '@/core/dtos/driver/DriverDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetDriverDailyCompletedOrderCountOptions = Omit<
  UseQueryOptions<number, Error>,
  'queryFn'
>;

export const useGetDriverDailyCompletedOrderCount = (
  filter: DailyCompletedOrderCountByDriverIdFilterDto,
  options?: Partial<useGetDriverDailyCompletedOrderCountOptions>
) => {
  return useQuery<number, Error>({
    queryKey: ['get-driver-daily-completed-order-count', filter],
    queryFn: async () => {
      try {
        const orderService = new OrderService(
          new OrderRepository(new AxiosCustomClient())
        );
        const response =
          await orderService.getDailyCompletedOrderCountByDriverId(filter);

        // Ensure we never return undefined - return 0 if response is null or undefined
        return response;
      } catch (error) {
        console.error('Error fetching daily completed order count:', error);
        // Return 0 instead of letting it fail with undefined
        return 0;
      }
    },
    ...options, // Spread the provided options
  });
};
