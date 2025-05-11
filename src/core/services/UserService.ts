import { RegisterDto } from '../dtos/auth/register/registerDto';
import { RegisterResponseDto } from '../dtos/auth/register/registerResponseDto';
import { GetUserByIdResponseDto } from '../dtos/user/get-user-by-id/GetUserByIdResponseDto';
import { UploadImageRequestDto } from '../dtos/user/image-upload/UploadImageRequestDto';
import { UploadImageResponseDto } from '../dtos/user/image-upload/UploadImageResponseDto';
import { ProfileUpdateRequestDto } from '../dtos/user/profile-update/ProfileUpdateRequestDto';
import { ProfileUpdateResponseDto } from '../dtos/user/profile-update/ProfileUpdateResponseDto';
import { IUserRepository } from '../interface/repository/IUserRepository';
import { IUserService } from '../interface/service/IUserService';
import { ValidationError } from '../repository/UserRepository';

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}
  async imageUpload(
    imageUploadDto: UploadImageRequestDto
  ): Promise<UploadImageResponseDto> {
    // for (const [key, value] of imageUploadDto.image.entries()) {
    //   console.log(`${key}:`, value);
    // }
    return await this.repository.imageUpload<
      UploadImageRequestDto,
      UploadImageResponseDto
    >(imageUploadDto);
  }
  async profileUpdate(
    profileUpdateDto: ProfileUpdateRequestDto
  ): Promise<ProfileUpdateResponseDto> {
    return await this.repository.profileUpdate<
      ProfileUpdateRequestDto,
      ProfileUpdateResponseDto
    >(profileUpdateDto);
  }

  async getUserById(userId: string): Promise<GetUserByIdResponseDto> {
    return await this.repository.getUserById<GetUserByIdResponseDto>(userId);
  }

  async register(loginDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      return await this.repository.register<RegisterDto, RegisterResponseDto>(
        loginDto
      );
    } catch (error) {
      // Re-throw the error to maintain the error type (ValidationError or Error)
      throw error;
    }
  }
}
