import { NextRequest, NextResponse } from 'next/server';

interface GooglePlacesResponse {
  predictions: Array<{
    description: string;
    place_id: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
    terms: Array<{
      offset: number;
      value: string;
    }>;
  }>;
  status: string;
  error_message?: string;
}

interface NominatimSearchResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
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

interface LocationSearchResult {
  formatted: string;
  latitude: number;
  longitude: number;
  place_id: string;
  components: {
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
}

interface LocationSearchResponse {
  success: boolean;
  data?: LocationSearchResult[];
  error?: string;
  message?: string;
}

// Helper function to determine which search service to use
function shouldUseGooglePlaces(): boolean {
  const nodeEnvironment = process.env.NEXT_PUBLIC_NODE_ENV;
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  // Use free API in development
  if (nodeEnvironment === 'development') {
    return false;
  }

  // In production, use Google Places only if API key exists
  return !!(googleApiKey && googleApiKey.trim());
}

// Google Places API implementation
async function fetchGooglePlacesData(
  query: string,
  apiKey: string
): Promise<LocationSearchResponse> {
  // Construct Google Places API URL
  const placesUrl = new URL(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json'
  );
  placesUrl.searchParams.set('input', query);
  placesUrl.searchParams.set('key', apiKey);
  placesUrl.searchParams.set('types', '(cities)');
  placesUrl.searchParams.set('language', 'en');

  // Make request to Google Places API with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 second timeout

  let googleResponse: Response;
  try {
    googleResponse = await fetch(placesUrl.toString(), {
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
        message: 'Request to search service timed out',
      };
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!googleResponse.ok) {
    console.error(
      `Google Places API error: ${googleResponse.status} ${googleResponse.statusText}`
    );
    return {
      success: false,
      error: 'EXTERNAL_SERVICE_ERROR',
      message: 'Unable to search locations',
    };
  }

  const placesData: GooglePlacesResponse = await googleResponse.json();

  // Handle Google API errors
  if (placesData.status !== 'OK') {
    console.error(
      `Google Places API status: ${placesData.status}`,
      placesData.error_message
    );

    switch (placesData.status) {
      case 'ZERO_RESULTS': {
        return {
          success: true,
          data: [],
          message: 'No locations found for the search query',
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
          message: 'Invalid search parameters',
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

  // Convert Google Places results to our format
  const results: LocationSearchResult[] = placesData.predictions.map(
    prediction => ({
      formatted: prediction.description,
      latitude: 0, // Google Places doesn't provide coordinates directly
      longitude: 0, // Would need Place Details API call for coordinates
      place_id: prediction.place_id,
      components: {
        city: prediction.structured_formatting.main_text,
        state: prediction.structured_formatting.secondary_text,
        country: prediction.terms.at(-1)?.value || '',
      },
    })
  );

  return {
    success: true,
    data: results,
  };
}

// Nominatim (OpenStreetMap) search implementation
async function fetchNominatimSearchData(
  query: string
): Promise<LocationSearchResponse> {
  // Construct Nominatim search URL
  const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
  nominatimUrl.searchParams.set('q', query);
  nominatimUrl.searchParams.set('format', 'json');
  nominatimUrl.searchParams.set('addressdetails', '1');
  nominatimUrl.searchParams.set('limit', '5');
  nominatimUrl.searchParams.set(
    'countrycodes',
    'mm,th,cn,us,gb,de,fr,jp,kr,sg'
  );

  // Make request to Nominatim with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000); // 15 second timeout

  let nominatimResponse: Response;
  try {
    nominatimResponse = await fetch(nominatimUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GlobalMart-App/1.0', // Required by Nominatim
      },
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'TIMEOUT_ERROR',
        message: 'Request to search service timed out',
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
      message: 'Unable to search locations',
    };
  }

  const nominatimData: NominatimSearchResponse[] =
    await nominatimResponse.json();

  // Convert Nominatim results to our format
  const results: LocationSearchResult[] = nominatimData.map(result => ({
    formatted: result.display_name,
    latitude: Number.parseFloat(result.lat),
    longitude: Number.parseFloat(result.lon),
    place_id: result.place_id.toString(),
    components: {
      city:
        result.address.city || result.address.town || result.address.village,
      state: result.address.state,
      country: result.address.country,
      neighbourhood: result.address.neighbourhood,
      suburb: result.address.suburb,
      road: result.address.road,
      postcode: result.address.postcode,
    },
  }));

  return {
    success: true,
    data: results,
  };
}

export async function GET(request: NextRequest) {
  try {
    // Extract search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate required parameters
    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_PARAMETERS',
          message: 'Search query is required',
        },
        { status: 400 }
      );
    }

    if (typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_QUERY',
          message: 'Search query must be at least 2 characters long',
        },
        { status: 400 }
      );
    }

    // Choose which service to use
    let searchResponse: LocationSearchResponse;

    if (shouldUseGooglePlaces()) {
      const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!;
      searchResponse = await fetchGooglePlacesData(query.trim(), googleApiKey);
    } else {
      // Use free Nominatim service
      searchResponse = await fetchNominatimSearchData(query.trim());
    }

    // Return the response
    return searchResponse.success
      ? NextResponse.json(searchResponse, { status: 200 })
      : NextResponse.json(searchResponse, { status: 500 });
  } catch (error) {
    console.error('Location search API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while searching locations',
      },
      { status: 500 }
    );
  }
}
