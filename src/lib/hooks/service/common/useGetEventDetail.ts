import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Event } from '@/core/entity/Event';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetEventDetailOptions = Omit<UseQueryOptions<Event, Error>, 'queryFn'>;

export const useGetEventDetail = (
  id: number,
  options?: GetEventDetailOptions
) => {
  return useQuery<Event, Error>({
    queryKey: ['get-event-detail', id],
    queryFn: async () => {
      const commonService = new CommonService(
        new CommonRepository(new AxiosCustomClient())
      );
      return await commonService.getEventDetail(id);
    },
    ...options, // Spread the provided options
  });
};
