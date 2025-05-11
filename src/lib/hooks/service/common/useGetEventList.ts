import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { EventList } from '@/core/entity/Event';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetEventListOptions = Omit<UseQueryOptions<EventList, Error>, 'queryFn'>;

export const useGetEventList = (options?: GetEventListOptions) => {
  return useQuery<EventList, Error>({
    queryKey: ['get-event-list'],
    queryFn: async () => {
      const commonService = new CommonService(
        new CommonRepository(new AxiosCustomClient())
      );
      return await commonService.getEventList();
    },
    ...options, // Spread the provided options
  });
};
