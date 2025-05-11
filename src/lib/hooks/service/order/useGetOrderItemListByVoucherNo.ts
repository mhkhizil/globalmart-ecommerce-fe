import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { OrderFilterDto } from '@/core/dtos/order/OrderFilterDto';
import {
  OrderItemListRequestByVoucherNo,
  OrderItemListResponseByVoucherNo,
  OrderListResponseDto,
} from '@/core/dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '@/core/dtos/order/OrderNotificationListresponseDto';
import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type useGetOrderItemListByVoucherNoOptions = Omit<
  UseQueryOptions<OrderItemListResponseByVoucherNo, Error>,
  'queryFn'
>;

export const useGetOrderItemListByVoucherNo = (
  requestDto: OrderItemListRequestByVoucherNo,
  options?: Partial<useGetOrderItemListByVoucherNoOptions>
) => {
  return useQuery<OrderItemListResponseByVoucherNo, Error>({
    queryKey: ['get-orderitem-by-voucher-no', requestDto],
    queryFn: async () => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getOrderItemListByVoucherNo(requestDto);
    },
    ...options, // Spread the provided options
  });
};
