export interface OtpRequestDto {
  email: string;
  otp: string;
}

export interface OtpResponseDto {
  message: string;
}

export interface ResendOtpRequestDto {
  email: string;
}

export interface ResendOtpResponseDto {
  message: string;
}
