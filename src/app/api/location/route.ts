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

    // Get API key from environment
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
        return NextResponse.json(
          {
            success: false,
            error: 'TIMEOUT_ERROR',
            message: 'Request to geocoding service timed out',
          } as ReverseGeocodingResponse,
          { status: 504 }
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!googleResponse.ok) {
      console.error(
        `Google Geocoding API error: ${googleResponse.status} ${googleResponse.statusText}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'EXTERNAL_SERVICE_ERROR',
          message: 'Unable to fetch location data',
        } as ReverseGeocodingResponse,
        { status: 502 }
      );
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
          return NextResponse.json(
            {
              success: false,
              error: 'NO_RESULTS',
              message: 'No address found for the provided coordinates',
            } as ReverseGeocodingResponse,
            { status: 404 }
          );
        }
        case 'OVER_QUERY_LIMIT': {
          return NextResponse.json(
            {
              success: false,
              error: 'QUOTA_EXCEEDED',
              message: 'Service temporarily unavailable due to quota limits',
            } as ReverseGeocodingResponse,
            { status: 429 }
          );
        }
        case 'REQUEST_DENIED': {
          return NextResponse.json(
            {
              success: false,
              error: 'ACCESS_DENIED',
              message: 'Service access denied',
            } as ReverseGeocodingResponse,
            { status: 403 }
          );
        }
        case 'INVALID_REQUEST': {
          return NextResponse.json(
            {
              success: false,
              error: 'INVALID_REQUEST',
              message: 'Invalid request parameters',
            } as ReverseGeocodingResponse,
            { status: 400 }
          );
        }
        default: {
          return NextResponse.json(
            {
              success: false,
              error: 'UNKNOWN_ERROR',
              message: 'An unexpected error occurred',
            } as ReverseGeocodingResponse,
            { status: 500 }
          );
        }
      }
    }

    // Extract the best result (usually the first one)
    const result = geocodingData.results[0];
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'NO_RESULTS',
          message: 'No address found for the provided coordinates',
        } as ReverseGeocodingResponse,
        { status: 404 }
      );
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
      administrative_area_level_1:
        addressComponents.administrative_area_level_1,
      administrative_area_level_2:
        addressComponents.administrative_area_level_2,
      country: addressComponents.country,
      postal_code: addressComponents.postal_code,
      place_id: result.place_id,
      latitude,
      longitude,
    };

    // Set cache headers for successful responses
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache for 1 hour
    headers.set('Vary', 'Accept-Encoding');

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: responseData,
      } as ReverseGeocodingResponse),
      {
        status: 200,
        headers,
      }
    );
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
