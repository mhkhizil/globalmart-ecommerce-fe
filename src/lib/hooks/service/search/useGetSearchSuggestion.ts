import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type GetSuggestion = Omit<UseQueryOptions<any, Error, string>, 'queryFn'> & {
  queryKey?: any[];
};

export const useGetSearchSuggestion = (
  debouncedQuery: string,
  options?: GetSuggestion
) => {
  return useQuery<any, Error, string>({
    queryKey: ['search-suggestion', debouncedQuery],
    queryFn: async ({ signal, meta }) => {
      if (!debouncedQuery || debouncedQuery === '') {
        return [];
      }
      return [];
      //   const response = await fetch('', {
      //     signal, //****  Use TanStack Query's built-in cancellation for slow networks: ******/
      //   }); //TODO: replace with acutal data fetching
    },
    refetchOnWindowFocus: false,
    enabled: !!debouncedQuery,
    ...options, // Spread the provided options
  });
};
