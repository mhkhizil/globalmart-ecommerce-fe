'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { syncLocaleFromCookie } from '@/lib/redux/slices/LanguageSlice';
import { migrateCookies } from '@/scripts/migrateCookies';

/**
 * Component that handles cookie migration when default locale changes
 * This should be included at a top level of your app
 */
export default function CookieMigration() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof globalThis === 'undefined') return;

    try {
      // Migrate cookies (ensures the cookie is set properly)
      migrateCookies();

      // Sync Redux with the cookie value
      dispatch(syncLocaleFromCookie());
    } catch (error) {
      console.error('Error in cookie migration:', error);
    }
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
