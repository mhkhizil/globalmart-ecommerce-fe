import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { UploadImageRequestDto } from '@/core/dtos/user/image-upload/UploadImageRequestDto';
import { UploadImageResponseDto } from '@/core/dtos/user/image-upload/UploadImageResponseDto';
import { UserRepository } from '@/core/repository/UserRepository';
import { UserService } from '@/core/services/UserService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type UploadImageOptions = Omit<
  UseMutationOptions<UploadImageResponseDto, Error, UploadImageRequestDto>,
  'mutationFn'
>;

export const useUploadImage = (options?: UploadImageOptions) => {
  return useMutation<UploadImageResponseDto, Error, UploadImageRequestDto>({
    mutationFn: async UploadImageData => {
      const userService = new UserService(
        new UserRepository(new AxiosCustomClient())
      );
      return await userService.imageUpload(UploadImageData);
    },
    ...options, // Spread the provided options
  });
};
