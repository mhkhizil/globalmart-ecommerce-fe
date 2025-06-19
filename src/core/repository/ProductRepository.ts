import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { IProductRepository } from '../interface/repository/IProductRepository';

export class ProductRepository implements IProductRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}
  async getProductListByMerchantId<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getProductListByMerchantId}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get product list');
    }
  }
  async getProductById<TResponseDto>(id: string): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getProductbyId}/${id}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get product');
    }
  }
  async getProductListByCategory<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getProductListByCategory}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get product list');
    }
  }
  async getAllProduct<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getAllProduct}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get product list');
    }
  }
  async createProduct<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.product.createProduct}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to create product');
    }
  }
  async getTrendingProductList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getTrendingProductList}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get trending product list');
    }
  }
  async getDealOfTheDay<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getDealOfTheDay}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get deal of the day');
    }
  }
  async getProductDetailByMerchant<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getProductDetailByMerchant}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get product detail');
    }
  }
  async getNewArrival<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.product.getNewArrival}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get new arrival');
    }
  }
}
