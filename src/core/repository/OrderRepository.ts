import { AxiosError } from 'axios';

import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import {
  CancelOrderByDriverRequestDto,
  UpdateOrderStatusDto,
} from '../dtos/order/UpdateOrderStatusDto';
import { IOrderRepository } from '../interface/repository/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}
  async createOrder<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.createOrder}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Fail to create Order');
    }
  }
  async getOrderItemById<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderItemById}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      // console.log(axiosError);
      throw new Error(
        axiosError.response?.data?.message || 'Fail to get order item!'
      );
    }
  }

  async getOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstance();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderList}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Order list');
    }
  }

  async getOrderListCount<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderListCount}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      //console.log(response.data);
      return response.data.OrderCount as TResponseDto;
    } catch {
      throw new Error('Unable to get Order list');
    }
  }

  async getMerchantOrderNotificationList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderNotificationList}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Order list');
    }
  }

  async getMerchantOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getMerchantOrderList}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Order list');
    }
  }

  async confirmOrder<TResponseDto>(id: string): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.confirmOrder}/${id}`;
      const response = await client.post(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Fail to create Order');
    }
  }

  async assignDriver<TRequestDto, TResponseDto>(
    id: string,
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.createOrder}/${id}`;
      const response = await client.post(url, requestDto);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Fail to create Order');
    }
  }

  async getCustomerOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderListbyCustomerId}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Order list');
    }
  }
  async getOrderById<TResponseDto>(id: string): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderById}/${id}`;
      const response = await client.get(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Order');
    }
  }
  async updateOrderStatus<TRequestDto, TResponseDto>(
    params: UpdateOrderStatusDto,
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.updateOrderStatus}`;
      const response = await client.post(url, requestDto, {
        params: params,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to update Order status');
    }
  }
  async getOrderItemListByVoucherNo<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getOrderItemListByVoucherNo}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Order item list');
    }
  }
  async getDriverOrderListCount<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getDriverOrderListCount}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.OrderCount as TResponseDto;
    } catch {
      throw new Error('Unable to get Driver order list count');
    }
  }
  async getDriverOrderList<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getDriverOrderList}`;

      const response = await client.get(url, {
        params: requestDto,
      });

      // Handle 204 No Content response
      if (response.status === 204) {
        return { order_items: [] } as unknown as TResponseDto;
      }

      // Handle different response structures
      // Case 1: No data at all
      if (!response.data) {
        return { order_items: [] } as unknown as TResponseDto;
      }

      // Case 2: Data has nested 'data' property that is the actual content
      if (response.data.data !== undefined) {
        // If nested data is an array, wrap it in order_items property
        if (Array.isArray(response.data.data)) {
          return { order_items: response.data.data } as unknown as TResponseDto;
        }

        return response.data.data as TResponseDto;
      }

      // Case 3: Data is directly an array
      if (Array.isArray(response.data)) {
        return { order_items: response.data } as unknown as TResponseDto;
      }

      // Case 4: Data itself is the response object (not nested, not array)
      return response.data as TResponseDto;
    } catch {
      // Return empty data instead of throwing an error
      return { order_items: [] } as unknown as TResponseDto;
    }
  }
  async getDriverOrderDetail<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getDriverOrderDetail}`;
      const response = await client.get(url, {
        params: requestDto,
      });
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to get Driver order detail');
    }
  }
  async updateDeliveryStatus<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.updateDeliveryStatus}`;
      const response = await client.post(
        url,
        {},
        {
          params: requestDto,
        }
      );
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to update Delivery status');
    }
  }
  async getDailyCompletedOrderCountByDriverId<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.getDailyCompletedOrderCountByDriverId}`;
      const response = await client.get(url, {
        params: requestDto,
      });

      // Handle various response structures to ensure we always return a valid value
      if (response.data && response.data.OrderCount !== undefined) {
        return response.data.OrderCount as TResponseDto;
      } else if (response.data === undefined) {
        // Return a default value (0 when used as number)
        return 0 as unknown as TResponseDto;
      } else {
        // In case the API returns data directly without data.data structure
        return response.data as TResponseDto;
      }
    } catch (error) {
      console.error('Repository error:', error);
      // Return a default value instead of throwing to prevent query failures
      return 0 as unknown as TResponseDto;
    }
  }
  async cancelOrderByMerchant<TResponseDto>(id: string): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.order.cancelOrderByMerchant}/${id}`;
      const response = await client.post(url);
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to cancel Order');
    }
  }
  async cancelOrderByDriver<TRequestDto, TResponseDto>(
    requestDto: TRequestDto
  ): Promise<TResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const dto = requestDto as CancelOrderByDriverRequestDto;
      const url = `${API_BASE_URL}/${apiEndPoints.order.cancelOrderByDriver}`;
      const response = await client.post(
        url,
        {},
        {
          params: {
            order_id: dto.order_id,
            merchant_id: dto.merchant_id,
          },
        }
      );
      return response.data.data as TResponseDto;
    } catch {
      throw new Error('Unable to cancel Order');
    }
  }
}
