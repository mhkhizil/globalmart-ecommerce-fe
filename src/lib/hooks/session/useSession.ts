import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { LoginResponseDto } from '@/core/dtos/auth/login/loginResponseDto';

export function useSession() {
  return useQuery<any, Error, any>({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await axios.get<LoginResponseDto['data']>(
        '/api/session',
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
          timeout: 10_000,
        }
      );
      return response.data.user
        ? (response.data.user as any)
        : { user: undefined };
    },
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale immediately
    gcTime: 0, // Don’t cache in memory after unmount
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
  });
}
