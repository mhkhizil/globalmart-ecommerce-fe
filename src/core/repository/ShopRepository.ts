import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { IShopRepository } from '../interface/repository/IShopRepository';

export class ShopRepository implements IShopRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async registerShop<TRequestDto, TResponseDto>(
    reqeustData: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.shop.registerShop}`;
      //   const formData=reqeustData as FormData
      //   for (const [key, value] of formData.entries()) {
      //     console.log(`${key}:`, value);
      //   }
      const response = await client.post(url, reqeustData);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get shoplist');
    }
  }

  async getMerchantShopList<TRequestDto, TResponseDto>(
    reqeustData: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.shop.getShopList}`;
      const response = await client.get(url, {
        params: reqeustData,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get shoplist');
    }
  }

  async getShopDetail<TRequestDto, TResponseDto>(
    reqeustData: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.shop.getShopDetail}/${reqeustData}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get shoplist');
    }
  }
}
