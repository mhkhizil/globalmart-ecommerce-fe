import { ContactInfoDto } from '@/core/dtos/common/ContactInfoDto';
import { ShopListResponseDto } from '@/core/dtos/shop/ShopResponseDto';
import { Event, EventList } from '@/core/entity/Event';

export interface ICommonService {
  getShopList(): Promise<ShopListResponseDto>;
  getContactInfo(): Promise<ContactInfoDto>;
  getEventList(): Promise<EventList>;
  getEventDetail(id: number): Promise<Event>;
}
