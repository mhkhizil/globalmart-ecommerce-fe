// src/lib/redux/slices/LanguageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getCookie, setCookie } from '@/lib/util/cookies'; // Adjust path to your utility file

export const supportedLocales = ['en', 'cn', 'mm', 'th'] as const;
export type Locale = (typeof supportedLocales)[number];

interface LanguageState {
  locale: Locale;
  isChanging: boolean; // Track if locale is actively being changed
}

// Safely check if we're in a browser
const isBrowser =
  typeof globalThis !== 'undefined' && typeof document !== 'undefined';

// Get initial locale from cookie if available
const getInitialLocale = (): Locale => {
  // Use safer check for browser environment
  if (!isBrowser) {
    return 'cn'; // Default for server-side
  }

  try {
    // Try to get from cookie
    const cookieLocale = getCookie('preferredLocale') as Locale | undefined;
    return cookieLocale && supportedLocales.includes(cookieLocale)
      ? cookieLocale
      : 'cn';
  } catch (error) {
    console.error('Error getting initial locale:', error);
    return 'cn';
  }
};

// Initialize with cookie value or default
const initialState: LanguageState = {
  locale: getInitialLocale(),
  isChanging: false,
};

// Helper function to set the locale cookie
const setLocaleCookie = (locale: Locale) => {
  if (!isBrowser) return; // Only run on client

  try {
    // Set the cookie for 1 year
    setCookie('preferredLocale', locale, {
      path: '/',
      maxAge: 31_536_000, // 1-year expiry
      sameSite: 'Lax',
      secure: globalThis.location.protocol === 'https:',
    });

    // Simple approach for production - navigate to same page with new locale
    if (process.env.NODE_ENV === 'production') {
      // Get current path
      const currentPath = globalThis.location.pathname;
      // Replace the current locale with the new one
      const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${locale}`);
      // Reload page with new locale
      globalThis.location.href = newPath;
    }
  } catch (error) {
    console.error('Error setting locale cookie:', error);
  }
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      // Only update if it's a valid locale and different from current
      if (
        supportedLocales.includes(action.payload) &&
        state.locale !== action.payload
      ) {
        state.isChanging = true;
        state.locale = action.payload;
        setLocaleCookie(action.payload); // Set the cookie when locale changes
      }
    },
    localeChangeComplete(state) {
      state.isChanging = false;
    },
    // Add a new action to sync the Redux state with the cookie
    syncLocaleFromCookie(state) {
      if (!isBrowser) return;

      try {
        const cookieLocale = getCookie('preferredLocale') as Locale | undefined;

        // Update state if cookie exists, is valid and differs from current
        if (
          cookieLocale &&
          supportedLocales.includes(cookieLocale) &&
          state.locale !== cookieLocale
        ) {
          state.locale = cookieLocale;
        }
      } catch (error) {
        console.error('Error syncing from cookie:', error);
      }
    },
  },
});

export const { setLocale, localeChangeComplete, syncLocaleFromCookie } =
  languageSlice.actions;
export const languageReducer = languageSlice.reducer;
