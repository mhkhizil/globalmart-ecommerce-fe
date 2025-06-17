import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { API_BASE_URL, apiEndPoints } from '@/lib/endpoints/endpoints';

import { ApplyCouponRequestDto } from '../dtos/coupon/ApplyCouponRequestDto';
import { ApplyCouponResponseDto } from '../dtos/coupon/ApplyCouponResponseDto';
import { CouponListResponseDto } from '../dtos/coupon/CouponListResponseDto';

export interface ICouponRepository {
  getCouponList(): Promise<CouponListResponseDto>;
  applyCoupon(
    requestDto: ApplyCouponRequestDto
  ): Promise<ApplyCouponResponseDto>;
}

export class CouponRepository implements ICouponRepository {
  constructor(private readonly axiosClient: AxiosCustomClient) {}

  async getCouponList(): Promise<CouponListResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.coupon.getCouponList}`;
      const response = await client.get(url);
      return response.data as CouponListResponseDto;
    } catch {
      throw new Error('Unable to get coupon list');
    }
  }

  async applyCoupon(
    requestDto: ApplyCouponRequestDto
  ): Promise<ApplyCouponResponseDto> {
    try {
      const client = this.axiosClient.createInstanceWithToken();
      const url = `${API_BASE_URL}/${apiEndPoints.coupon.applyCoupon}`;
      const response = await client.post(url, requestDto);
      return response.data as ApplyCouponResponseDto;
    } catch {
      throw new Error('Unable to apply coupon');
    }
  }
}
