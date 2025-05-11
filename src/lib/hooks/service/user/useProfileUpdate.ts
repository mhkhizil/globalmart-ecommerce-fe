import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { ProfileUpdateRequestDto } from '@/core/dtos/user/profile-update/ProfileUpdateRequestDto';
import { ProfileUpdateResponseDto } from '@/core/dtos/user/profile-update/ProfileUpdateResponseDto';
import { UserRepository } from '@/core/repository/UserRepository';
import { UserService } from '@/core/services/UserService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type ProfileUpdateOptions = Omit<
  UseMutationOptions<ProfileUpdateResponseDto, Error, ProfileUpdateRequestDto>,
  'mutationFn'
>;

export const useProfileUpdate = (options?: ProfileUpdateOptions) => {
  return useMutation<ProfileUpdateResponseDto, Error, ProfileUpdateRequestDto>({
    mutationFn: async ProfileUpdateData => {
      const userService = new UserService(
        new UserRepository(new AxiosCustomClient())
      );
      return await userService.profileUpdate(ProfileUpdateData);
    },
    ...options, // Spread the provided options
  });
};
