export interface ApplyCouponResponseDto {
  status: string;
  message: string;
  data: {
    discount: string;
  };
}
