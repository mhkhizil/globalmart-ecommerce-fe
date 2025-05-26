'use server';
import axios from 'axios';
import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { ShopType } from '@/core/entity/Shop';
import { CommonRepository } from '@/core/repository/CommonRepository';
import { CommonService } from '@/core/services/CommonService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

import MerchantRegisterPageClient from './MerchantRegisterPageClient';

// Define basic types for the lists (replace with actual types if known)
interface Country {
  id: string | number;
  name: string;
  // ... other properties
}

interface State {
  id: string | number;
  name: string;
  // ... other properties
}

interface City {
  id: string | number;
  name: string;
  // ... other properties
}

async function MerchantRegisterPageServer() {
  // Initialize with default empty arrays
  let shopList: ShopType[] = [];
  let countryList: Country[] = [];
  let stateList: State[] = [];
  let cityList: City[] = [];

  try {
    const commonService = new CommonService(
      new CommonRepository(new AxiosCustomClient())
    );

    // Define URLs (ensure these environment variables are set)
    const countryURL = process.env.NEXT_PUBLIC_COUNTIRES_RESOURCES;
    const stateURL = process.env.NEXT_PUBLIC_STATES_RESOURCES;
    const cityURL = process.env.NEXT_PUBLIC_CITIES_RESOURCES;

    // Specify the expected return type for getShopList if possible
    // Let's assume it returns { shoptypes: ShopType[] }
    type ShopListResponse = { shoptypes?: ShopType[] };

    // Create safe fetch functions that won't throw
    const safeGetShopList = async (): Promise<ShopListResponse> => {
      try {
        return (await commonService.getShopList()) as ShopListResponse;
      } catch (error) {
        console.error('Failed to fetch shop list:', error);
        return { shoptypes: [] };
      }
    };

    const safeAxiosGet = async <T,>(
      url: string | undefined
    ): Promise<{ data: T[] }> => {
      if (!url) {
        return { data: [] };
      }
      try {
        const response = await axios.get<T[]>(url);
        return response;
      } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
        return { data: [] };
      }
    };

    // Fetch all data in parallel using Promise.allSettled with safe functions
    const results = await Promise.allSettled([
      safeGetShopList(),
      safeAxiosGet<Country>(countryURL),
      safeAxiosGet<State>(stateURL),
      safeAxiosGet<City>(cityURL),
    ]);

    // Process results, providing defaults for failures
    const shopListResult = results[0];
    const countryListResult = results[1];
    const stateListResult = results[2];
    const cityListResult = results[3];

    if (shopListResult.status === 'fulfilled') {
      shopList = shopListResult.value?.shoptypes ?? [];
    } else {
      console.error('Failed to fetch shop list:', shopListResult.reason);
      // shopList remains []
    }

    if (countryListResult.status === 'fulfilled') {
      countryList = countryListResult.value?.data ?? [];
    } else {
      console.error('Failed to fetch country list:', countryListResult.reason);
      // countryList remains []
    }

    if (stateListResult.status === 'fulfilled') {
      stateList = stateListResult.value?.data ?? [];
    } else {
      console.error('Failed to fetch state list:', stateListResult.reason);
      // stateList remains []
    }

    if (cityListResult.status === 'fulfilled') {
      cityList = cityListResult.value?.data ?? [];
    } else {
      console.error('Failed to fetch city list:', cityListResult.reason);
      // cityList remains []
    }
  } catch (error) {
    // Catch any unexpected errors during the entire process
    console.error('Unexpected error in MerchantRegisterPageServer:', error);
    // All lists remain as empty arrays (already initialized above)
  }

  return (
    <MerchantRegisterPageClient
      shopList={shopList} // Use processed data
      countryList={countryList} // Use processed data
      stateList={stateList} // Use processed data
      cityList={cityList} // Use processed data
    />
  );
}

export default async function MerchantRegisterPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantRegisterPageServer />
    </Suspense>
  );
}
