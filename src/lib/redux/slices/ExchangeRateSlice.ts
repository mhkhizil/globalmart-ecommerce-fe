import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Currency as CurrencyDto,
  GetAllCurrencyResponseDto,
} from '@/core/dtos/currency/CurrencyDto';

import { Currency } from './CurrencySlice';

export interface ExchangeRate {
  currency_code: string;
  rate: number;
  symbol: string;
  decimal_place: number;
  updated_at: string;
}

export interface ExchangeRateState {
  rates: ExchangeRate[];
  ratesMap: Record<string, number>; // Optimized lookup: ratesMap[currency_code] = rate (relative to MMK)
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  lastFetchAttempt: string | null;
}

const initialState: ExchangeRateState = {
  rates: [],
  ratesMap: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
  lastFetchAttempt: null,
};

// Mock exchange rates for testing (1 unit of currency = X MMK)
const MOCK_EXCHANGE_RATES: Record<string, number> = {
  USD: 2100, // 1 USD = 2100 MMK
  THB: 60, // 1 THB = 60 MMK
  CNY: 294, // 1 CNY = 294 MMK
  MMK: 1, // 1 MMK = 1 MMK (base currency)
};

// Helper function to build optimized rates map from API response
const buildRatesMap = (currencies: CurrencyDto[]): Record<string, number> => {
  const ratesMap: Record<string, number> = {};

  // If no currencies provided or empty, use mock rates
  if (!currencies || currencies.length === 0) {
    console.log('⚠️ No currencies from API, using mock rates');
    return { ...MOCK_EXCHANGE_RATES };
  }

  currencies.forEach(currency => {
    // The API provides rates relative to MMK, so we store them as currency_code: rate
    const rate = Number.parseFloat(currency.rate);

    // Validate the rate
    if (Number.isNaN(rate) || rate <= 0) {
      console.warn(
        `⚠️ Invalid rate for ${currency.currency_code}: "${currency.rate}", using mock rate`
      );
      // Use mock rate if available
      if (MOCK_EXCHANGE_RATES[currency.currency_code]) {
        ratesMap[currency.currency_code] =
          MOCK_EXCHANGE_RATES[currency.currency_code];
      }
    } else {
      ratesMap[currency.currency_code] = rate;
    }
  });

  // Ensure MMK has a rate of 1 (base currency)
  ratesMap['MMK'] = 1;

  // Add any missing supported currencies with mock rates
  Object.entries(MOCK_EXCHANGE_RATES).forEach(([currency, rate]) => {
    if (!ratesMap[currency]) {
      ratesMap[currency] = rate;
    }
  });
  return ratesMap;
};

const exchangeRateSlice = createSlice({
  name: 'exchangeRate',
  initialState,
  reducers: {
    // Start fetching exchange rates
    fetchExchangeRatesStart(state) {
      state.isLoading = true;
      state.error = null;
      state.lastFetchAttempt = new Date().toISOString();
    },

    // Successfully fetched exchange rates
    fetchExchangeRatesSuccess(
      state,
      action: PayloadAction<GetAllCurrencyResponseDto>
    ) {
      state.isLoading = false;
      state.error = null;

      // Handle different possible response structures
      let currencies: CurrencyDto[] = [];

      if (action.payload.data && Array.isArray(action.payload.data)) {
        currencies = action.payload.data;
      } else if (Array.isArray(action.payload)) {
        currencies = action.payload as CurrencyDto[];
      } else if (action.payload && typeof action.payload === 'object') {
        // Check if the payload has other possible field names
        const possibleFields = ['exchange_rate', 'rates', 'currencies', 'data'];
        for (const field of possibleFields) {
          if (
            (action.payload as any)[field] &&
            Array.isArray((action.payload as any)[field])
          ) {
            currencies = (action.payload as any)[field];
            break;
          }
        }
      }

      state.rates = currencies.map(currency => ({
        currency_code: currency.currency_code,
        rate: Number.parseFloat(currency.rate),
        symbol: currency.symbol,
        decimal_place: currency.decimal_place,
        updated_at: currency.updated_at,
      }));
      state.ratesMap = buildRatesMap(currencies);
      state.lastUpdated = new Date().toISOString();
    },

    // Failed to fetch exchange rates
    fetchExchangeRatesFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearExchangeRateError(state) {
      state.error = null;
    },

    // Reset exchange rate state
    resetExchangeRates(state) {
      return initialState;
    },
  },
});

export const {
  fetchExchangeRatesStart,
  fetchExchangeRatesSuccess,
  fetchExchangeRatesFailure,
  clearExchangeRateError,
  resetExchangeRates,
} = exchangeRateSlice.actions;

export const exchangeRateReducer = exchangeRateSlice.reducer;

// Selectors
export const selectExchangeRateState = (state: {
  exchangeRate: ExchangeRateState;
}) => state.exchangeRate;
export const selectExchangeRates = (state: {
  exchangeRate: ExchangeRateState;
}) => state.exchangeRate.rates;
export const selectExchangeRatesMap = (state: {
  exchangeRate: ExchangeRateState;
}) => state.exchangeRate.ratesMap;
export const selectExchangeRateLoading = (state: {
  exchangeRate: ExchangeRateState;
}) => state.exchangeRate.isLoading;
export const selectExchangeRateError = (state: {
  exchangeRate: ExchangeRateState;
}) => state.exchangeRate.error;
export const selectExchangeRateLastUpdated = (state: {
  exchangeRate: ExchangeRateState;
}) => state.exchangeRate.lastUpdated;

// Helper selector to get specific exchange rate (from MMK to target currency)
export const selectExchangeRate = (
  state: { exchangeRate: ExchangeRateState },
  targetCurrency: Currency
): number | null => {
  const ratesMap = state.exchangeRate.ratesMap;
  return ratesMap[targetCurrency] || null;
};
