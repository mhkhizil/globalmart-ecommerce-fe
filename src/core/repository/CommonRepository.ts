import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { ICommonRepository } from '../interface/repository/ICommonRepository';

export class CommonRepository implements ICommonRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async getShopList<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.common.shopList}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get shoplist');
    }
  }

  async getContactInfo<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.common.contactInfo}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get contact info');
    }
  }

  async getEventList<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.common.eventList}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get event list');
    }
  }

  async getEventDetail<TResponseDto>(id: number): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.common.eventDetail}/${id}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get event detail');
    }
  }

  async getAllCurrency<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.exchangeRate.getAllExchangeRate}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get all currency');
    }
  }

  async getCurrencyByCurrencyCode<TResponseDto>(
    currencyCode: string
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.exchangeRate.getExchangeRateByCurrencyCode}`;
      const response = await client.get(url, {
        params: {
          currency_code: currencyCode,
        },
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get currency by currency code');
    }
  }
}
