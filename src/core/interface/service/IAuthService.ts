import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
} from '@/core/dtos/auth/forgot-password/ForgotPassword';
import { LoginRequestDto } from '@/core/dtos/auth/login/loginRequestDto';
import { LoginResponseDto } from '@/core/dtos/auth/login/loginResponseDto';
import {
  OtpRequestDto,
  OtpResponseDto,
  ResendOtpRequestDto,
  ResendOtpResponseDto,
} from '@/core/dtos/auth/otp/Otp';
import {
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@/core/dtos/auth/reset-password/ResetPasswordDto';

export interface IAuthService {
  login(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
  logout: () => Promise<{ message: string }>;
  forgotPassword(
    forgotPasswordDto: ForgotPasswordRequestDto
  ): Promise<ForgotPasswordResponseDto>;
  resetPassword(
    resetPasswordDto: ResetPasswordRequestDto
  ): Promise<ResetPasswordResponseDto>;
  verifyOtp(verifyOtpDto: OtpRequestDto): Promise<OtpResponseDto>;
  resendOtp(resendOtpDto: ResendOtpRequestDto): Promise<ResendOtpResponseDto>;
}
