import {
  DailyCompletedOrderCountByDriverIdFilterDto,
  DriverOrderDetailRequestDto,
  DriverOrderDto,
  DriverOrderListRequestDto,
  DriverOrderListResponseDto,
} from '@/core/dtos/driver/DriverDto';
import { AssignDriverRequestDto } from '@/core/dtos/order/AssignDriverReqeustDto';
import { UpdateOrderStatusRequestDto } from '@/core/dtos/order/ConfirmOrderReqeustDto';
import { CreateOrderRequestDto } from '@/core/dtos/order/CreateOrderReqeustDto';
import {
  CustomerOrderListFilterDto,
  DriverOrderListCountFilterDto,
  MerchantOrderDetailDto,
  OrderCountFilterDto,
  OrderFilterDto,
} from '@/core/dtos/order/OrderFilterDto';
import {
  CustomerOrderListResponseDto,
  OrderItemListRequestByVoucherNo,
  OrderItemListResponseByVoucherNo,
  OrderListResponseDto,
} from '@/core/dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '@/core/dtos/order/OrderNotificationListresponseDto';
import {
  OrderItemResponseDto,
  OrderResponseDto,
} from '@/core/dtos/order/OrderResponseDto';
import {
  CancelOrderByDriverRequestDto,
  UpdateDeliveryStatusDto,
  UpdateOrderStatusDto,
} from '@/core/dtos/order/UpdateOrderStatusDto';
import { Order, OrderItem } from '@/core/entity/Order';

export abstract class IOrderService {
  abstract createOrder(orderData: CreateOrderRequestDto): Promise<any>;
  abstract getOrderList(filter: OrderFilterDto): Promise<OrderListResponseDto>;
  abstract getOrderListCount(filter: OrderCountFilterDto): Promise<number>;
  abstract getOrderItemById(
    requestDto: MerchantOrderDetailDto
  ): Promise<OrderItemResponseDto>;
  abstract getMerchantOrderList(
    filter: OrderFilterDto
  ): Promise<OrderListResponseDto>;
  abstract getMerchantOrderNotificationList(
    filter: OrderFilterDto
  ): Promise<OrderNotificationListResponseDto>;
  abstract confirmOrder(id: string): Promise<OrderItem>;
  abstract assignDriver(
    id: string,
    assignDriverData: AssignDriverRequestDto
  ): Promise<any>;
  abstract getCustomerOrderList(
    filter: CustomerOrderListFilterDto
  ): Promise<CustomerOrderListResponseDto>;
  abstract getOrderById(id: string): Promise<Order>;
  abstract updateOrderStatus(
    params: UpdateOrderStatusDto,
    updateOrderStatusData: UpdateOrderStatusRequestDto
  ): Promise<any>;
  abstract getOrderItemListByVoucherNo(
    requestDto: OrderItemListRequestByVoucherNo
  ): Promise<OrderItemListResponseByVoucherNo>;
  abstract getDriverOrderListCount(
    requestDto: DriverOrderListCountFilterDto
  ): Promise<number>;
  abstract getDriverOrderList(
    requestDto: DriverOrderListRequestDto
  ): Promise<DriverOrderListResponseDto>;
  abstract getDriverOrderDetail(
    requestDto: DriverOrderDetailRequestDto
  ): Promise<DriverOrderDto>;
  abstract updateDeliveryStatus(
    requestDto: UpdateDeliveryStatusDto
  ): Promise<any>;
  abstract getDailyCompletedOrderCountByDriverId(
    requestDto: DailyCompletedOrderCountByDriverIdFilterDto
  ): Promise<number>;
  abstract cancelOrderByMerchant(id: string): Promise<any>;
  abstract cancelOrderByDriver(
    requestDto: CancelOrderByDriverRequestDto
  ): Promise<any>;
}
