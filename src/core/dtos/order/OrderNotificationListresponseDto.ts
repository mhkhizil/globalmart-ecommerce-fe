import { OrderNotificationItem } from '@/core/entity/Order';

export interface OrderNotificationListResponseDto {
  order_items: OrderNotificationItem[];
}
