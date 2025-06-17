import { ApplyCouponRequestDto } from '../dtos/coupon/ApplyCouponRequestDto';
import { ApplyCouponResponseDto } from '../dtos/coupon/ApplyCouponResponseDto';
import { CouponListResponseDto } from '../dtos/coupon/CouponListResponseDto';
import { ICouponRepository } from '../repository/CouponRepository';

export class CouponService {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async getCouponList(): Promise<CouponListResponseDto> {
    return await this.couponRepository.getCouponList();
  }

  async applyCoupon(
    requestDto: ApplyCouponRequestDto
  ): Promise<ApplyCouponResponseDto> {
    return await this.couponRepository.applyCoupon(requestDto);
  }
}
