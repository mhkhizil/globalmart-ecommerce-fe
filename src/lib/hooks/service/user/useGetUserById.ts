import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';

import { LoginResponseDto } from '@/core/dtos/auth/login/loginResponseDto';
import { GetUserByIdResponseDto } from '@/core/dtos/user/get-user-by-id/GetUserByIdResponseDto';
import { UserRepository } from '@/core/repository/UserRepository';
import { UserService } from '@/core/services/UserService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetUserOptions = Omit<
  UseQueryOptions<GetUserByIdResponseDto, Error>,
  'queryFn'
>;

export const useGetUser = (options?: GetUserOptions) => {
  return useQuery<GetUserByIdResponseDto, Error>({
    queryKey: ['get-user-by-id'],
    queryFn: async () => {
      try {
        const userService = new UserService(
          new UserRepository(new AxiosCustomClient())
        );
        const response = await axios.get<any>('/api/session', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
          timeout: 10_000,
        });

        const user = await userService.getUserById(response.data.user?.user.id);

        return user;
      } catch {
        throw new Error('Unable to get user id');
      }
    },
    ...options, // Spread the provided options
  });
};
