import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { ICategoryRepository } from '../interface/repository/ICategoryRepository';

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async getCategoryList<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.category.categoryList}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Categorylist');
    }
  }
}
