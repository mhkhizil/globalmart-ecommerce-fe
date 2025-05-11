import { UpdateOrderStatusDto } from '@/core/dtos/order/UpdateOrderStatusDto';

export abstract class IOrderRepository {
  abstract createOrder<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getOrderItemById<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getMerchantOrderNotificationList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getMerchantOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract confirmOrder<TResponseDto>(id: string): Promise<TResponseDto>;
  abstract assignDriver<TRequestDto, TResponseDto>(
    id: string,
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getOrderListCount<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getCustomerOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getOrderById<TResponseDto>(id: string): Promise<TResponseDto>;
  abstract updateOrderStatus<TRequestDto, TResponseDto>(
    params: UpdateOrderStatusDto,
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getOrderItemListByVoucherNo<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getDriverOrderListCount<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getDriverOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getDriverOrderDetail<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract updateDeliveryStatus<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract getDailyCompletedOrderCountByDriverId<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
  abstract cancelOrderByMerchant<TResponseDto>(
    id: string
  ): Promise<TResponseDto>;
  abstract cancelOrderByDriver<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto>;
}
