import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';

import { AuthRepository } from '@/core/repository/AuthRepository';
import { AuthService } from '@/core/services/AuthService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type LoginOption = Omit<
  UseMutationOptions<{ message: string }, Error>,
  'mutationFn'
>;

export const useLogout = (option: LoginOption) => {
  return useMutation<{ message: string }, Error>({
    mutationKey: ['login'],
    mutationFn: async () => {
      const service = new AuthService(
        new AuthRepository(new AxiosCustomClient())
      );
      axios.delete('/api/session');
      return await service.logout();
    },
    ...option,
  });
};
