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

  // Fetch all data in parallel using Promise.allSettled
  const results = await Promise.allSettled([
    commonService.getShopList() as Promise<ShopListResponse>, // Type assertion for getShopList result
    countryURL
      ? axios.get<Country[]>(countryURL)
      : Promise.resolve({ data: [] }), // Promise 1: Countries
    stateURL ? axios.get<State[]>(stateURL) : Promise.resolve({ data: [] }), // Promise 2: States
    cityURL ? axios.get<City[]>(cityURL) : Promise.resolve({ data: [] }), // Promise 3: Cities
  ]);

  // Process results, providing defaults for failures
  const shopListResult = results[0];
  const countryListResult = results[1];
  const stateListResult = results[2];
  const cityListResult = results[3];

  let shopList: ShopType[] = [];
  if (shopListResult.status === 'fulfilled') {
    shopList = shopListResult.value?.shoptypes ?? [];
  } else {
    console.error('Failed to fetch shop list:', shopListResult.reason);
    // shopList remains []
  }

  let countryList: Country[] = [];
  if (countryListResult.status === 'fulfilled') {
    countryList = countryListResult.value?.data ?? [];
  } else {
    console.error('Failed to fetch country list:', countryListResult.reason);
    // countryList remains []
  }

  let stateList: State[] = [];
  if (stateListResult.status === 'fulfilled') {
    stateList = stateListResult.value?.data ?? [];
  } else {
    console.error('Failed to fetch state list:', stateListResult.reason);
    // stateList remains []
  }

  let cityList: City[] = [];
  if (cityListResult.status === 'fulfilled') {
    cityList = cityListResult.value?.data ?? [];
  } else {
    console.error('Failed to fetch city list:', cityListResult.reason);
    // cityList remains []
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
