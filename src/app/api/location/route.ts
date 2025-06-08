import { NextRequest, NextResponse } from 'next/server';

interface GoogleGeocodingResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
    types: string[];
  }>;
  status: string;
  error_message?: string;
}

interface NominatimGeocodingResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}

interface ReverseGeocodingResponse {
  success: boolean;
  data?: {
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
  };
  error?: string;
  message?: string;
}

// Helper function to determine which geocoding service to use
function shouldUseGoogleAPI(): boolean {
  const nodeEnvironment = process.env.NEXT_PUBLIC_NODE_ENV;
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  // Use free API in development
  if (nodeEnvironment === 'development') {
    return false;
  }

  // In production, use Google API only if API key exists
  return !!(googleApiKey && googleApiKey.trim());
}

// Google Geocoding API implementation
async function fetchGoogleGeocodingData(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<ReverseGeocodingResponse> {
  // Construct Google Geocoding API URL
  const geocodingUrl = new URL(
    'https://maps.googleapis.com/maps/api/geocode/json'
  );
  geocodingUrl.searchParams.set('latlng', `${latitude},${longitude}`);
  geocodingUrl.searchParams.set('key', apiKey);
  geocodingUrl.searchParams.set(
    'result_type',
    'street_address|route|locality|political'
  );

  // Make request to Google Geocoding API with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 second timeout

  let googleResponse: Response;
  try {
    googleResponse = await fetch(geocodingUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'TIMEOUT_ERROR',
        message: 'Request to geocoding service timed out',
      };
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!googleResponse.ok) {
    console.error(
      `Google Geocoding API error: ${googleResponse.status} ${googleResponse.statusText}`
    );
    return {
      success: false,
      error: 'EXTERNAL_SERVICE_ERROR',
      message: 'Unable to fetch location data',
    };
  }

  const geocodingData: GoogleGeocodingResponse = await googleResponse.json();

  // Handle Google API errors
  if (geocodingData.status !== 'OK') {
    console.error(
      `Google Geocoding API status: ${geocodingData.status}`,
      geocodingData.error_message
    );

    switch (geocodingData.status) {
      case 'ZERO_RESULTS': {
        return {
          success: false,
          error: 'NO_RESULTS',
          message: 'No address found for the provided coordinates',
        };
      }
      case 'OVER_QUERY_LIMIT': {
        return {
          success: false,
          error: 'QUOTA_EXCEEDED',
          message: 'Service temporarily unavailable due to quota limits',
        };
      }
      case 'REQUEST_DENIED': {
        return {
          success: false,
          error: 'ACCESS_DENIED',
          message: 'Service access denied',
        };
      }
      case 'INVALID_REQUEST': {
        return {
          success: false,
          error: 'INVALID_REQUEST',
          message: 'Invalid request parameters',
        };
      }
      default: {
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred',
        };
      }
    }
  }

  // Extract the best result (usually the first one)
  const result = geocodingData.results[0];
  if (!result) {
    return {
      success: false,
      error: 'NO_RESULTS',
      message: 'No address found for the provided coordinates',
    };
  }

  // Parse address components
  const addressComponents: Record<string, string> = {};
  result.address_components.forEach(component => {
    component.types.forEach(type => {
      addressComponents[type] = component.long_name;
    });
  });

  // Construct response data
  const responseData = {
    formatted_address: result.formatted_address,
    street_number: addressComponents.street_number,
    route: addressComponents.route,
    locality: addressComponents.locality,
    administrative_area_level_1: addressComponents.administrative_area_level_1,
    administrative_area_level_2: addressComponents.administrative_area_level_2,
    country: addressComponents.country,
    postal_code: addressComponents.postal_code,
    place_id: result.place_id,
    latitude,
    longitude,
  };

  return {
    success: true,
    data: responseData,
  };
}

// Nominatim (OpenStreetMap) Geocoding API implementation
async function fetchNominatimGeocodingData(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResponse> {
  // Construct Nominatim API URL
  const nominatimUrl = new URL('https://nominatim.openstreetmap.org/reverse');
  nominatimUrl.searchParams.set('format', 'json');
  nominatimUrl.searchParams.set('lat', latitude.toString());
  nominatimUrl.searchParams.set('lon', longitude.toString());
  nominatimUrl.searchParams.set('addressdetails', '1');
  nominatimUrl.searchParams.set('zoom', '18'); // High detail level
  nominatimUrl.searchParams.set('accept-language', 'en'); // Force English language

  // Make request to Nominatim API with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 second timeout

  let nominatimResponse: Response;
  try {
    nominatimResponse = await fetch(nominatimUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GlobalMart/1.0 (contact@globalmart.com)', // Required by Nominatim usage policy
        'Accept-Language': 'en-US,en;q=0.9', // Prefer English in headers as well
      },
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'TIMEOUT_ERROR',
        message: 'Request to geocoding service timed out',
      };
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!nominatimResponse.ok) {
    console.error(
      `Nominatim API error: ${nominatimResponse.status} ${nominatimResponse.statusText}`
    );
    return {
      success: false,
      error: 'EXTERNAL_SERVICE_ERROR',
      message: 'Unable to fetch location data',
    };
  }

  const nominatimData: NominatimGeocodingResponse =
    await nominatimResponse.json();

  // Check if we got a valid response
  if (!nominatimData || !nominatimData.display_name) {
    return {
      success: false,
      error: 'NO_RESULTS',
      message: 'No address found for the provided coordinates',
    };
  }

  // Map Nominatim response to our standard format
  const address = nominatimData.address || {};

  // Build formatted address similar to Google's format
  const addressParts: string[] = [];
  if (address.house_number && address.road) {
    addressParts.push(`${address.house_number} ${address.road}`);
  } else if (address.road) {
    addressParts.push(address.road);
  }

  const locality =
    address.city || address.town || address.village || address.municipality;
  if (locality) {
    addressParts.push(locality);
  }

  if (address.state) {
    addressParts.push(address.state);
  }

  if (address.postcode) {
    addressParts.push(address.postcode);
  }

  if (address.country) {
    addressParts.push(address.country);
  }

  const formattedAddress =
    addressParts.length > 0
      ? addressParts.join(', ')
      : nominatimData.display_name;

  // Construct response data
  const responseData = {
    formatted_address: formattedAddress,
    street_number: address.house_number,
    route: address.road,
    locality: locality,
    administrative_area_level_1: address.state,
    administrative_area_level_2: address.county,
    country: address.country,
    postal_code: address.postcode,
    place_id: nominatimData.place_id.toString(),
    latitude,
    longitude,
  };

  return {
    success: true,
    data: responseData,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // Validate required parameters
    if (!lat || !lng) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_PARAMETERS',
          message: 'Both latitude and longitude parameters are required',
        } as ReverseGeocodingResponse,
        { status: 400 }
      );
    }

    // Validate parameter format
    const latitude = Number.parseFloat(lat);
    const longitude = Number.parseFloat(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PARAMETERS',
          message: 'Latitude and longitude must be valid numbers',
        } as ReverseGeocodingResponse,
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_LATITUDE',
          message: 'Latitude must be between -90 and 90 degrees',
        } as ReverseGeocodingResponse,
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_LONGITUDE',
          message: 'Longitude must be between -180 and 180 degrees',
        } as ReverseGeocodingResponse,
        { status: 400 }
      );
    }

    // Determine which geocoding service to use
    const useGoogleAPI = shouldUseGoogleAPI();
    let geocodingResult: ReverseGeocodingResponse;

    if (useGoogleAPI) {
      // Use Google API
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found in environment variables');
        return NextResponse.json(
          {
            success: false,
            error: 'CONFIGURATION_ERROR',
            message: 'Service temporarily unavailable',
          } as ReverseGeocodingResponse,
          { status: 500 }
        );
      }

      geocodingResult = await fetchGoogleGeocodingData(
        latitude,
        longitude,
        apiKey
      );
    } else {
      // Use Nominatim (OpenStreetMap) API

      geocodingResult = await fetchNominatimGeocodingData(latitude, longitude);
    }

    // Handle the result
    if (!geocodingResult.success) {
      const statusCode =
        geocodingResult.error === 'NO_RESULTS'
          ? 404
          : geocodingResult.error === 'TIMEOUT_ERROR'
            ? 504
            : geocodingResult.error === 'QUOTA_EXCEEDED'
              ? 429
              : geocodingResult.error === 'ACCESS_DENIED'
                ? 403
                : geocodingResult.error === 'INVALID_REQUEST'
                  ? 400
                  : 502;

      return NextResponse.json(geocodingResult, { status: statusCode });
    }

    // Set cache headers for successful responses
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache for 1 hour
    headers.set('Vary', 'Accept-Encoding');

    return new NextResponse(JSON.stringify(geocodingResult), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred',
      } as ReverseGeocodingResponse,
      { status: 500 }
    );
  }
}
