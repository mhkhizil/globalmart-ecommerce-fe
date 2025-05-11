import {
  DailyCompletedOrderCountByDriverIdFilterDto,
  DriverOrderDetailRequestDto,
  DriverOrderDto,
  DriverOrderListRequestDto,
  DriverOrderListResponseDto,
} from '../dtos/driver/DriverDto';
import { AssignDriverRequestDto } from '../dtos/order/AssignDriverReqeustDto';
import { UpdateOrderStatusRequestDto } from '../dtos/order/ConfirmOrderReqeustDto';
import { CreateOrderRequestDto } from '../dtos/order/CreateOrderReqeustDto';
import {
  CustomerOrderListFilterDto,
  DriverOrderListCountFilterDto,
  MerchantOrderDetailDto,
  OrderCountFilterDto,
  OrderFilterDto,
} from '../dtos/order/OrderFilterDto';
import {
  CustomerOrderListResponseDto,
  OrderItemListRequestByVoucherNo,
  OrderItemListResponseByVoucherNo,
  OrderListResponseDto,
} from '../dtos/order/OrderListResponseDto';
import { OrderNotificationListResponseDto } from '../dtos/order/OrderNotificationListresponseDto';
import {
  OrderItemResponseDto,
  OrderResponseDto,
} from '../dtos/order/OrderResponseDto';
import {
  CancelOrderByDriverRequestDto,
  UpdateDeliveryStatusDto,
  UpdateOrderStatusDto,
} from '../dtos/order/UpdateOrderStatusDto';
import { Order, OrderItem } from '../entity/Order';
import { IOrderRepository } from '../interface/repository/IOrderRepository';
import { IOrderService } from '../interface/service/IOrderService';
export class OrderService implements IOrderService {
  constructor(private readonly OrderRepository: IOrderRepository) {}
  async getMerchantOrderList(
    filter: OrderFilterDto
  ): Promise<OrderListResponseDto> {
    const response = await this.OrderRepository.getMerchantOrderList<
      OrderFilterDto,
      OrderListResponseDto
    >(filter);
    return response;
  }
  async getOrderListCount(filter: OrderCountFilterDto): Promise<number> {
    const response = await this.OrderRepository.getOrderListCount<
      OrderCountFilterDto,
      number
    >(filter);
    return response;
  }
  async getMerchantOrderNotificationList(
    filter: OrderFilterDto
  ): Promise<OrderNotificationListResponseDto> {
    const response =
      await this.OrderRepository.getMerchantOrderNotificationList<
        OrderFilterDto,
        OrderNotificationListResponseDto
      >(filter);
    return response;
  }
  async confirmOrder(id: string): Promise<any> {
    const response = await this.OrderRepository.confirmOrder<OrderItem>(id);
    return response;
  }
  async assignDriver(
    id: string,
    assignDriverData: AssignDriverRequestDto
  ): Promise<any> {
    const response = await this.OrderRepository.assignDriver<
      AssignDriverRequestDto,
      any
    >(id, assignDriverData);
    return response;
  }
  async createOrder(filter: CreateOrderRequestDto): Promise<any> {
    const response = await this.OrderRepository.createOrder<
      CreateOrderRequestDto,
      any
    >(filter);
    return response;
  }
  async getOrderList(filter: OrderFilterDto): Promise<OrderListResponseDto> {
    const response = await this.OrderRepository.getOrderList<
      OrderFilterDto,
      OrderListResponseDto
    >(filter);
    return response;
  }

  async getOrderItemById(
    requestDto: MerchantOrderDetailDto
  ): Promise<OrderItemResponseDto> {
    const response = await this.OrderRepository.getOrderItemById<
      MerchantOrderDetailDto,
      OrderItemResponseDto
    >(requestDto);
    return response;
  }
  async getCustomerOrderList(
    filter: CustomerOrderListFilterDto
  ): Promise<CustomerOrderListResponseDto> {
    const response = await this.OrderRepository.getCustomerOrderList<
      CustomerOrderListFilterDto,
      CustomerOrderListResponseDto
    >(filter);
    return response;
  }
  async getOrderById(id: string): Promise<Order> {
    const response = await this.OrderRepository.getOrderById<Order>(id);
    return response;
  }
  async updateOrderStatus(
    params: UpdateOrderStatusDto,
    updateOrderStatusData: UpdateOrderStatusRequestDto
  ): Promise<any> {
    const response = await this.OrderRepository.updateOrderStatus<
      UpdateOrderStatusRequestDto,
      any
    >(params, updateOrderStatusData);
    return response;
  }
  async getOrderItemListByVoucherNo(
    requestDto: OrderItemListRequestByVoucherNo
  ): Promise<OrderItemListResponseByVoucherNo> {
    const response = await this.OrderRepository.getOrderItemListByVoucherNo<
      OrderItemListRequestByVoucherNo,
      OrderItemListResponseByVoucherNo
    >(requestDto);
    return response;
  }
  async getDriverOrderListCount(
    filter: DriverOrderListCountFilterDto
  ): Promise<number> {
    const response = await this.OrderRepository.getDriverOrderListCount<
      DriverOrderListCountFilterDto,
      number
    >(filter);
    return response;
  }
  async getDriverOrderList(
    filter: DriverOrderListRequestDto
  ): Promise<DriverOrderListResponseDto> {
    try {
      const response = await this.OrderRepository.getDriverOrderList<
        DriverOrderListRequestDto,
        DriverOrderListResponseDto
      >(filter);

      // Ensure response has the expected structure
      if (!response) {
        return { order_items: [] };
      }

      // If response is not in expected format, transform it
      if (!response.order_items) {
        // If response is an array, wrap it in the expected structure
        if (Array.isArray(response)) {
          return { order_items: response };
        }

        // If response is an object but has unexpected structure
        return { order_items: [] };
      }

      return response;
    } catch {
      return { order_items: [] };
    }
  }
  async getDriverOrderDetail(
    requestDto: DriverOrderDetailRequestDto
  ): Promise<DriverOrderDto> {
    const response = await this.OrderRepository.getDriverOrderDetail<
      DriverOrderDetailRequestDto,
      DriverOrderDto
    >(requestDto);
    return response;
  }
  async updateDeliveryStatus(
    requestDto: UpdateDeliveryStatusDto
  ): Promise<any> {
    const response = await this.OrderRepository.updateDeliveryStatus<
      UpdateDeliveryStatusDto,
      any
    >(requestDto);
    return response;
  }
  async getDailyCompletedOrderCountByDriverId(
    requestDto: DailyCompletedOrderCountByDriverIdFilterDto
  ): Promise<number> {
    try {
      const response =
        await this.OrderRepository.getDailyCompletedOrderCountByDriverId<
          DailyCompletedOrderCountByDriverIdFilterDto,
          number | null | undefined
        >(requestDto);

      // Ensure we return a number (0 if response is null or undefined)
      return typeof response === 'number' ? response : 0;
    } catch (error) {
      console.error('Error in getDailyCompletedOrderCountByDriverId:', error);
      // Return 0 instead of re-throwing to prevent undefined errors
      return 0;
    }
  }
  async cancelOrderByMerchant(id: string): Promise<any> {
    const response = await this.OrderRepository.cancelOrderByMerchant<any>(id);
    return response;
  }
  async cancelOrderByDriver(
    requestDto: CancelOrderByDriverRequestDto
  ): Promise<any> {
    const response = await this.OrderRepository.cancelOrderByDriver<
      CancelOrderByDriverRequestDto,
      any
    >(requestDto);
    return response;
  }
}
