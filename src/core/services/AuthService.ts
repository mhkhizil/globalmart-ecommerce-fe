import { LoginRequestDto } from '../dtos/auth/login/loginRequestDto';
import { LoginResponseDto } from '../dtos/auth/login/loginResponseDto';
import { IAuthRepository } from '../interface/repository/IAuthRepository';
import { IAuthService } from '../interface/service/IAuthService';

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}
  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.authRepository.login<
      LoginRequestDto,
      LoginResponseDto
    >(loginDto);

    if (response.response === 402) {
      throw new Error(response.description);
    }

    await fetch('/api/session/', {
      method: 'POST',
      body: JSON.stringify({
        token: response.data.token,
        user: response.data.user,
      }),
    });
    return response;
  }
  async logout(): Promise<{ message: string }> {
    await this.authRepository.logout();
    return { message: 'Logout Successfully' };
  }
}
