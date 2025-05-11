import { AxiosError } from 'axios';

import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { IPaymentRepository } from '../interface/repository/IPaymentRepository';

export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async addPayment<TReqeustDto, TResponseDto>(
    reqeustDto: TReqeustDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.addPayment}`;
      const response = await client.post(url, reqeustDto);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to add payment method'
      );
    }
  }

  async addPaymentV2<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.addPayment}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to add payment method'
      );
    }
  }

  async updatePayment<TReqeustDto, TResponseDto>(
    reqeustDto: TReqeustDto,
    id: string
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.updatePayment}/${id}`;
      const response = await client.post(url, reqeustDto);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to update payment method'
      );
    }
  }

  async updatePaymentV2<TRequestDto, TResponseDto>(
    requestDto: TRequestDto,
    id: string
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.updatePayment}/${id}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to update payment method'
      );
    }
  }

  async getPaymentListByMerchantId<TResponseDto>(
    merchantId: string
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.getPaymentListByMerchantId}`;
      const response = await client.get(url, {
        params: { merchant_id: merchantId },
      });
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to get payment list'
      );
    }
  }
  async getCustomerWallet<TResponseDto>(userId: string): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.getWalletBalance}`;
      const response = await client.get(url, {
        params: { user_id: userId },
      });
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to get wallet balance'
      );
    }
  }
  async refillWallet<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.refillWallet}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to refill wallet'
      );
    }
  }
  async getAvailablePaymentList<TResponseDto>(): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.getAvailablePaymentList}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message ||
          'Fail to get available payment list'
      );
    }
  }
  async getTransactionList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.payment.getTransactionList}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      throw new Error(
        axiosError.response?.data?.message || 'Fail to get transaction list'
      );
    }
  }
}
