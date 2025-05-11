import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type LoginOption = Omit<UseMutationOptions<any, Error>, 'mutationFn'>;

export const useGoogleLogin = (option: LoginOption) => {
  return useMutation<void, Error>({
    mutationKey: ['googleLogin'],
    mutationFn: async () => {
      //   await fetch('/api/auth/google',{
      //     method:'GET'
      //   })
      //   return
      globalThis.location.href = '/api/auth/google/login';
    },
    ...option,
  });
};
