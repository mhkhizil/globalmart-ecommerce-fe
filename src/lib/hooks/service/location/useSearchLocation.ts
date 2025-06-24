import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Types for the location search response
export interface LocationSearchResult {
  formatted: string;
  latitude: number;
  longitude: number;
  place_id: string;
  components: {
    city?: string;
    state?: string;
    country?: string;
    neighbourhood?: string;
    suburb?: string;
    road?: string;
    postcode?: string;
    [key: string]: any;
  };
}

export interface LocationSearchResponse {
  success: boolean;
  data?: LocationSearchResult[];
  error?: string;
  message?: string;
}

// Custom error class for location search errors
export class LocationSearchError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'LocationSearchError';
  }
}

// Input parameters for the hook
export interface UseSearchLocationParams {
  query: string;
}

// Options type for the hook
type SearchLocationOptions = Omit<
  UseQueryOptions<LocationSearchResult[], LocationSearchError>,
  'queryFn' | 'queryKey'
>;

/**
 * React Query hook for searching locations
 * Searches for locations worldwide based on user input
 *
 * @param params - Object containing search query
 * @param options - Additional React Query options
 * @returns React Query result with location search results
 */
export const useSearchLocation = (
  params: UseSearchLocationParams,
  options?: Partial<SearchLocationOptions>
) => {
  const { query } = params;

  return useQuery<LocationSearchResult[], LocationSearchError>({
    queryKey: ['location-search', query],
    queryFn: async (): Promise<LocationSearchResult[]> => {
      // Validate input parameters
      if (typeof query !== 'string') {
        throw new LocationSearchError(
          'Invalid search query: must be a string',
          'INVALID_QUERY',
          400
        );
      }

      if (query.trim().length < 2) {
        throw new LocationSearchError(
          'Search query must be at least 2 characters long',
          'INVALID_QUERY',
          400
        );
      }

      // Construct API URL
      const url = new URL('/api/location-search', globalThis.location.origin);
      url.searchParams.set('q', query.trim());

      let response: Response;

      try {
        // Make request with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15_000); // 15 second timeout

        response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new LocationSearchError(
              'Request timeout: The search service is taking too long to respond',
              'TIMEOUT_ERROR',
              408
            );
          }

          // Network or other fetch errors
          throw new LocationSearchError(
            'Network error: Unable to connect to search service',
            'NETWORK_ERROR',
            0
          );
        }

        throw new LocationSearchError(
          'Unknown error occurred while searching locations',
          'UNKNOWN_ERROR',
          500
        );
      }

      // Parse response
      let responseData: LocationSearchResponse;

      try {
        responseData = await response.json();
      } catch {
        throw new LocationSearchError(
          'Invalid response format from search service',
          'INVALID_RESPONSE',
          response.status
        );
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage =
          responseData.message || 'Location search service error';
        const errorCode = responseData.error || 'HTTP_ERROR';

        throw new LocationSearchError(errorMessage, errorCode, response.status);
      }

      // Handle API-level errors
      if (!responseData.success) {
        const errorMessage =
          responseData.message || 'Failed to search locations';
        const errorCode = responseData.error || 'API_ERROR';

        throw new LocationSearchError(errorMessage, errorCode, response.status);
      }

      // Return results (empty array if no results)
      return responseData.data || [];
    },
    // Default options
    enabled: !!(query && query.trim().length >= 2), // Only run if query is valid
    staleTime: 1000 * 60 * 5, // 5 minutes - search results can be cached briefly
    gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache for reasonable time
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) except timeout
      if (error instanceof LocationSearchError) {
        if (error.status && error.status >= 400 && error.status < 500) {
          return error.code === 'TIMEOUT_ERROR' && failureCount < 2;
        }
        // Retry on server errors (5xx) up to 3 times
        if (error.status && error.status >= 500) {
          return failureCount < 3;
        }
        // Retry on network errors up to 2 times
        if (error.code === 'NETWORK_ERROR') {
          return failureCount < 2;
        }
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000), // Exponential backoff
    // Merge with user-provided options
    ...options,
  });
};

/**
 * Hook variant that only runs when explicitly enabled
 * Useful when you want to control when the search request is made
 */
export const useSearchLocationLazy = (
  params: UseSearchLocationParams,
  options?: Partial<SearchLocationOptions & { enabled?: boolean }>
) => {
  return useSearchLocation(params, {
    ...options,
    enabled: options?.enabled ?? false,
  });
};

/**
 * Utility function to validate search query without making a request
 */
export const validateSearchQuery = (
  query: string
): { valid: boolean; error?: string } => {
  if (typeof query !== 'string') {
    return { valid: false, error: 'Query must be a string' };
  }

  if (query.trim().length < 2) {
    return {
      valid: false,
      error: 'Query must be at least 2 characters long',
    };
  }

  return { valid: true };
};
