export interface ResetPasswordRequestDto {
  otp: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordResponseDto {
  message: string;
}
