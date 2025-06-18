import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getCookie, setCookie } from '@/lib/util/cookies';

export const supportedCurrencies = ['USD', 'THB', 'MMK', 'CNY'] as const;
export type Currency = (typeof supportedCurrencies)[number];

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
}

export const currencyInfo: Record<Currency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
  },
  THB: {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    flag: '🇹🇭',
  },
  MMK: {
    code: 'MMK',
    symbol: 'K',
    name: 'Myanmar Kyat',
    flag: '🇲🇲',
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    flag: '🇨🇳',
  },
};

interface CurrencyState {
  selectedCurrency: Currency;
  isChanging: boolean;
}

// Safely check if we're in a browser
const isBrowser =
  typeof globalThis !== 'undefined' && typeof document !== 'undefined';

// Get initial currency from cookie if available
const getInitialCurrency = (): Currency => {
  if (!isBrowser) {
    return 'USD'; // Default for server-side
  }

  try {
    const cookieCurrency = getCookie('preferredCurrency') as
      | Currency
      | undefined;
    return cookieCurrency && supportedCurrencies.includes(cookieCurrency)
      ? cookieCurrency
      : 'USD';
  } catch (error) {
    console.error('Error getting initial currency:', error);
    return 'USD';
  }
};

const initialState: CurrencyState = {
  selectedCurrency: getInitialCurrency(),
  isChanging: false,
};

// Helper function to set the currency cookie
const setCurrencyCookie = (currency: Currency) => {
  if (!isBrowser) return;

  try {
    setCookie('preferredCurrency', currency, {
      path: '/',
      maxAge: 31_536_000, // 1-year expiry
      sameSite: 'Lax',
      secure: globalThis.location.protocol === 'https:',
    });
  } catch (error) {
    console.error('Error setting currency cookie:', error);
  }
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
      if (
        supportedCurrencies.includes(action.payload) &&
        state.selectedCurrency !== action.payload
      ) {
        state.isChanging = true;
        state.selectedCurrency = action.payload;
        setCurrencyCookie(action.payload);
      }
    },
    currencyChangeComplete(state) {
      state.isChanging = false;
    },
    syncCurrencyFromCookie(state) {
      if (!isBrowser) return;

      try {
        const cookieCurrency = getCookie('preferredCurrency') as
          | Currency
          | undefined;

        if (
          cookieCurrency &&
          supportedCurrencies.includes(cookieCurrency) &&
          state.selectedCurrency !== cookieCurrency
        ) {
          state.selectedCurrency = cookieCurrency;
        }
      } catch (error) {
        console.error('Error syncing currency from cookie:', error);
      }
    },
  },
});

export const { setCurrency, currencyChangeComplete, syncCurrencyFromCookie } =
  currencySlice.actions;
export const currencyReducer = currencySlice.reducer;
