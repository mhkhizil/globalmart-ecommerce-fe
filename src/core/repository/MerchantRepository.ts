import { AxiosError } from 'axios';

import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { IMerchantRepository } from '../interface/repository/IMerchantRepository';
import { ValidationError } from './UserRepository';

export class MerchantRepository implements IMerchantRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}
  async register<TRequestDto, TResponseDto>(
    registerDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.merchant.register}`;
      const response = await client.post(url, registerDto);
      return response as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message);
    }
  }
  async registerDriver<TRequestDto, TResponseDto>(
    registerDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      console.log(
        'MerchantRepository.registerDriver - Starting driver registration'
      );
      console.log(
        'Request data type:',
        registerDto instanceof FormData ? 'FormData' : typeof registerDto
      );

      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.merchant.registerDriver}`;

      // Log the request URL for debugging
      console.log('Request URL:', url);

      const response = await client.post(url, registerDto);
      console.log('Driver registration successful:', response.status);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      console.error('Driver registration error:', error);

      // Check if it's an Axios error to extract more details
      const axiosError = error as AxiosError<any>;

      if (axiosError.response) {
        // Server returned an error response
        console.error('Server error details:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
          headers: axiosError.response.headers,
        });

        // Check if this is a validation error
        if (
          axiosError.response.status === 422 &&
          axiosError.response.data?.errors
        ) {
          throw new ValidationError(
            axiosError.response.data.message || 'Validation failed',
            axiosError.response.data.errors
          );
        }
      } else if (axiosError.request) {
        // Request was made but no response received
        console.error('No response received from server:', axiosError.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', axiosError.message);
      }

      throw new Error(
        axiosError.response?.data?.message || 'Failed to register driver'
      );
    }
  }
  async getDriverListByMerchantId<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.merchant.getDriverListByMerchantId}`;
      const response = await client.get(url, { params: requestDto });
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message);
    }
  }
  async assignDriverToOrder<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.merchant.assignDriverToOrder}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message);
    }
  }
  async getWeeklyChartData<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.merchant.getWeeklyChartData}`;
      const response = await client.get(url, { params: requestDto });
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message);
    }
  }
  async createDiscount<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.discount.createDiscount}`;
      const response = await client.post(url, requestDto);
      return response.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message);
    }
  }
  async getMerchantWithdrawList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.merchant.getMerchantWithdrawHistory}`;
      const response = await client.get(url, { params: requestDto });
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(axiosError.response?.data?.message);
    }
  }
}
