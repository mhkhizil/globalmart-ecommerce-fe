import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ContactInfoDto } from '@/core/dtos/common/ContactInfoDto';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type GetContactInfoOptions = Omit<
  UseQueryOptions<ContactInfoDto, Error>,
  'queryFn'
>;

export const useGetContactInfo = (options?: GetContactInfoOptions) => {
  return useQuery<ContactInfoDto, Error>({
    queryKey: ['get-contact-info'],
    queryFn: async () => {
      const commonService = new CommonService(
        new CommonRepository(new AxiosCustomClient())
      );
      return await commonService.getContactInfo();
    },
    ...options, // Spread the provided options
  });
};
