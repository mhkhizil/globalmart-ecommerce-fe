import { RegisterDto } from '@/core/dtos/auth/register/registerDto';
import { RegisterResponseDto } from '@/core/dtos/auth/register/registerResponseDto';
import { GetUserByIdResponseDto } from '@/core/dtos/user/get-user-by-id/GetUserByIdResponseDto';
import { UploadImageRequestDto } from '@/core/dtos/user/image-upload/UploadImageRequestDto';
import { UploadImageResponseDto } from '@/core/dtos/user/image-upload/UploadImageResponseDto';
import { ProfileUpdateRequestDto } from '@/core/dtos/user/profile-update/ProfileUpdateRequestDto';
import { ProfileUpdateResponseDto } from '@/core/dtos/user/profile-update/ProfileUpdateResponseDto';

export interface IUserService {
  /**
   * Register a new user
   * @throws {ValidationError} When validation fails with field-specific errors
   * @throws {Error} For other registration failures
   */
  register(loginDto: RegisterDto): Promise<RegisterResponseDto>;

  imageUpload(
    imageUploadDto: UploadImageRequestDto
  ): Promise<UploadImageResponseDto>;

  profileUpdate(
    profileUpdateDto: ProfileUpdateRequestDto
  ): Promise<ProfileUpdateResponseDto>;

  getUserById(userId: string): Promise<GetUserByIdResponseDto>;
}
