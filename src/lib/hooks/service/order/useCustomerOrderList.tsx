import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { CustomerOrderListFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { CustomerOrderListResponseDto } from '@/core/dtos/order/OrderListResponseDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetCustomerOrderListOptions = Omit<
  UseQueryOptions<CustomerOrderListResponseDto, Error>,
  'queryFn'
>;

export const useGetCustomerOrderList = (
  filter: CustomerOrderListFilterDto,
  options?: Partial<useGetCustomerOrderListOptions>
) => {
  return useQuery<CustomerOrderListResponseDto, Error>({
    queryKey: ['get-customer-order-list', filter],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getCustomerOrderList(filter);
    },
    ...options, // Spread the provided options
  });
};
