import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { IPromotionRepository } from '../interface/repository/IPromotionRepository';

export class PromotionRepository implements IPromotionRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async getPromotionList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      // console.log('PromotionRepository: Request params:', requestDto);
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.promotion.promotionList}`;
      // console.log('PromotionRepository: API URL:', url);

      const response = await client.get(url, {
        params: requestDto,
      });

      // console.log('PromotionRepository: API Response:', response.data);
      return response.data.data as TResponseDto;
    } catch (error) {
      console.error('PromotionRepository: Error fetching promotions:', error);
      throw new Error('Unable to get Promotionlist');
    }
  }
}
