import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Types for the reverse geocoding response
export interface LocationData {
  formatted_address: string;
  street_number?: string;
  route?: string;
  locality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  country?: string;
  postal_code?: string;
  place_id: string;
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodingResponse {
  success: boolean;
  data?: LocationData;
  error?: string;
  message?: string;
}

// Custom error class for location-related errors
export class LocationError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'LocationError';
  }
}

// Input parameters for the hook
export interface UseGetLocationParams {
  lat: number;
  lng: number;
}

// Options type for the hook
type GetLocationOptions = Omit<
  UseQueryOptions<LocationData, LocationError>,
  'queryFn' | 'queryKey'
>;

/**
 * React Query hook for reverse geocoding
 * Fetches address information from latitude and longitude coordinates
 *
 * @param params - Object containing lat and lng coordinates
 * @param options - Additional React Query options
 * @returns React Query result with location data
 */
export const useGetLocation = (
  params: UseGetLocationParams,
  options?: Partial<GetLocationOptions>
) => {
  const { lat, lng } = params;

  return useQuery<LocationData, LocationError>({
    queryKey: ['reverse-geocoding', lat, lng],
    queryFn: async (): Promise<LocationData> => {
      // Validate input parameters
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new LocationError(
          'Invalid coordinates: latitude and longitude must be numbers',
          'INVALID_COORDINATES',
          400
        );
      }

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        throw new LocationError(
          'Invalid coordinates: latitude and longitude cannot be NaN',
          'INVALID_COORDINATES',
          400
        );
      }

      if (lat < -90 || lat > 90) {
        throw new LocationError(
          'Invalid latitude: must be between -90 and 90 degrees',
          'INVALID_LATITUDE',
          400
        );
      }

      if (lng < -180 || lng > 180) {
        throw new LocationError(
          'Invalid longitude: must be between -180 and 180 degrees',
          'INVALID_LONGITUDE',
          400
        );
      }

      // Construct API URL
      const url = new URL('/api/location', globalThis.location.origin);
      url.searchParams.set('lat', lat.toString());
      url.searchParams.set('lng', lng.toString());

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
            throw new LocationError(
              'Request timeout: The location service is taking too long to respond',
              'TIMEOUT_ERROR',
              408
            );
          }

          // Network or other fetch errors
          throw new LocationError(
            'Network error: Unable to connect to location service',
            'NETWORK_ERROR',
            0
          );
        }

        throw new LocationError(
          'Unknown error occurred while fetching location',
          'UNKNOWN_ERROR',
          500
        );
      }

      // Parse response
      let responseData: ReverseGeocodingResponse;

      try {
        responseData = await response.json();
      } catch {
        throw new LocationError(
          'Invalid response format from location service',
          'INVALID_RESPONSE',
          response.status
        );
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = responseData.message || 'Location service error';
        const errorCode = responseData.error || 'HTTP_ERROR';

        throw new LocationError(errorMessage, errorCode, response.status);
      }

      // Handle API-level errors
      if (!responseData.success) {
        const errorMessage =
          responseData.message || 'Failed to get location data';
        const errorCode = responseData.error || 'API_ERROR';

        throw new LocationError(errorMessage, errorCode, response.status);
      }

      // Validate response data
      if (!responseData.data) {
        throw new LocationError(
          'No location data received from service',
          'NO_DATA',
          response.status
        );
      }

      return responseData.data;
    },
    // Default options
    enabled: !!(lat && lng && !Number.isNaN(lat) && !Number.isNaN(lng)), // Only run if coordinates are valid
    staleTime: 1000 * 60 * 60, // 1 hour - location data doesn't change frequently
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for a day
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) except timeout
      if (error instanceof LocationError) {
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
 * Useful when you want to control when the geocoding request is made
 */
export const useGetLocationLazy = (
  params: UseGetLocationParams,
  options?: Partial<GetLocationOptions & { enabled?: boolean }>
) => {
  return useGetLocation(params, {
    ...options,
    enabled: options?.enabled ?? false,
  });
};

/**
 * Utility function to validate coordinates without making a request
 */
export const validateCoordinates = (
  lat: number,
  lng: number
): { valid: boolean; error?: string } => {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { valid: false, error: 'Coordinates must be numbers' };
  }

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { valid: false, error: 'Coordinates cannot be NaN' };
  }

  if (lat < -90 || lat > 90) {
    return {
      valid: false,
      error: 'Latitude must be between -90 and 90 degrees',
    };
  }

  if (lng < -180 || lng > 180) {
    return {
      valid: false,
      error: 'Longitude must be between -180 and 180 degrees',
    };
  }

  return { valid: true };
};
