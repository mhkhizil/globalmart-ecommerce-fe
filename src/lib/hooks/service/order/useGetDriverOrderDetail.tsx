import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
  DriverOrderDetailRequestDto,
  DriverOrderDto,
} from '@/core/dtos/driver/DriverDto';
import { OrderFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { OrderListResponseDto } from '@/core/dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '@/core/dtos/order/OrderNotificationListresponseDto';
import { Order } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetDriverOrderDetailOptions = Omit<
  UseQueryOptions<DriverOrderDto, Error>,
  'queryFn'
>;

export const useGetDriverOrderDetail = (
  requestDto: DriverOrderDetailRequestDto,
  options?: Partial<useGetDriverOrderDetailOptions>
) => {
  return useQuery<DriverOrderDto, Error>({
    queryKey: ['get-driver-order-detail-by-id', requestDto],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getDriverOrderDetail(requestDto);
    },
    ...options, // Spread the provided options
  });
};
