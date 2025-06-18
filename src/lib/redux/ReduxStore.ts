import { configureStore } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';

import { navigationBarReducer } from '../redux/slices/NavigationBarSlice';
import { cartReducer } from './slices/CartSlice';
import { currencyReducer } from './slices/CurrencySlice';
import { languageReducer } from './slices/LanguageSlice';
import shippingAddressReducer from './slices/ShippingAddressSlice';

// Configure localforage for persistence with SSR safety
const isClient = typeof globalThis !== 'undefined';

if (isClient) {
  localforage.config({
    driver: [
      localforage.INDEXEDDB, // Try IndexedDB first
      localforage.LOCALSTORAGE, // Fallback to localStorage
      localforage.WEBSQL, // Fallback to WebSQL (if available)
    ],
    name: 'AppStoreDB',
    storeName: 'appState',
    version: 1,
  });
}

// Create storage that falls back gracefully in SSR
const createStorage = () => {
  if (isClient) {
    return localforage;
  }
  // Fallback storage for SSR that does nothing
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};

// Persist configuration for the cart slice
const cartPersistConfig = {
  key: 'cart',
  storage: createStorage(),
  // whitelist: ['carts','currentUserId'], // Only persist the 'currentUserId' and 'carts' part of the cart slice
};

const languagePersistConfig = {
  key: 'language',
  storage: createStorage(),
  whitelist: ['locale'], // Only persist the 'locale' field
};

const currencyPersistConfig = {
  key: 'currency',
  storage: createStorage(),
  whitelist: ['selectedCurrency'], // Only persist the 'selectedCurrency' field
};

// Persist configuration for the shipping address slice
const shippingAddressPersistConfig = {
  key: 'shippingAddress',
  storage: createStorage(),
};

// Combine reducers with persistence for the cart slice
const rootReducer = {
  navigationBar: navigationBarReducer,
  cart: persistReducer(cartPersistConfig, cartReducer), // Apply persistence to the cart slice
  language: persistReducer(languagePersistConfig, languageReducer),
  currency: persistReducer(currencyPersistConfig, currencyReducer),
  shippingAddress: persistReducer(
    shippingAddressPersistConfig,
    shippingAddressReducer
  ),
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export default store;
