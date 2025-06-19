import { ContactInfoDto } from '../dtos/common/ContactInfoDto';
import {
  GetAllCurrencyResponseDto,
  GetCurrencyByCurrencyCodeResponseDto,
} from '../dtos/currency/CurrencyDto';
import { ShopListResponseDto } from '../dtos/shop/ShopResponseDto';
import { Event, EventList } from '../entity/Event';
import { ICommonRepository } from '../interface/repository/ICommonRepository';
import { ICommonService } from '../interface/service/ICommonService';

export class CommonService implements ICommonService {
  constructor(private readonly CommonRepository: ICommonRepository) {}
  async getShopList(): Promise<ShopListResponseDto> {
    const response =
      await this.CommonRepository.getShopList<ShopListResponseDto>();

    return response;
  }

  async getContactInfo(): Promise<ContactInfoDto> {
    const response =
      await this.CommonRepository.getContactInfo<ContactInfoDto>();

    return response;
  }

  async getEventList(): Promise<EventList> {
    const response = await this.CommonRepository.getEventList<EventList>();

    return response;
  }

  async getEventDetail(id: number): Promise<Event> {
    const response = await this.CommonRepository.getEventDetail<Event>(id);

    return response;
  }

  async getAllCurrency(): Promise<GetAllCurrencyResponseDto> {
    const response =
      await this.CommonRepository.getAllCurrency<GetAllCurrencyResponseDto>();

    return response;
  }

  async getCurrencyByCurrencyCode(
    currencyCode: string
  ): Promise<GetCurrencyByCurrencyCodeResponseDto> {
    const response =
      await this.CommonRepository.getCurrencyByCurrencyCode<GetCurrencyByCurrencyCodeResponseDto>(
        currencyCode
      );

    return response;
  }
}
