import { configureStore } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { persistReducer, persistStore } from 'redux-persist';

import { navigationBarReducer } from '../redux/slices/NavigationBarSlice';
import { cartReducer } from './slices/CartSlice';
import { languageReducer } from './slices/LanguageSlice';
import shippingAddressReducer from './slices/ShippingAddressSlice';

// Configure localforage for persistence
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

// Persist configuration for the cart slice
const cartPersistConfig = {
  key: 'cart',
  storage: localforage,
  // whitelist: ['carts','currentUserId'], // Only persist the 'currentUserId' and 'carts' part of the cart slice
};

const languagePersistConfig = {
  key: 'language',
  storage: localforage,
  whitelist: ['locale'], // Only persist the 'locale' field
};

// Persist configuration for the shipping address slice
const shippingAddressPersistConfig = {
  key: 'shippingAddress',
  storage: localforage,
};

// Combine reducers with persistence for the cart slice
const rootReducer = {
  navigationBar: navigationBarReducer,
  cart: persistReducer(cartPersistConfig, cartReducer), // Apply persistence to the cart slice
  language: persistReducer(languagePersistConfig, languageReducer),
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
        ignoredActions: ['persist/PERSIST'], // Ignore redux-persist actions
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export default store;
