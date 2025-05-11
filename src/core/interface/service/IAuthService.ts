import { LoginRequestDto } from '@/core/dtos/auth/login/loginRequestDto';
import { LoginResponseDto } from '@/core/dtos/auth/login/loginResponseDto';

export interface IAuthService {
  login(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
  logout: () => Promise<{ message: string }>;
}
