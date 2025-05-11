'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseAdsOptions {
  /**
   * Initial enabled state for ads
   * @default true
   */
  initialEnabled?: boolean;
  /**
   * Storage key for tracking ad preferences
   * @default 'ads_preferences'
   */
  storageKey?: string;
  /**
   * Enable/disable local storage persistence for ad preferences
   * @default true
   */
  persistPreferences?: boolean;
}

export interface UseAdsReturn {
  /**
   * Whether ads are currently enabled
   */
  adsEnabled: boolean;
  /**
   * Toggle ads on/off
   */
  toggleAds: () => void;
  /**
   * Explicitly enable ads
   */
  enableAds: () => void;
  /**
   * Explicitly disable ads
   */
  disableAds: () => void;
  /**
   * Reset shown ads for the current session
   */
  resetShownAds: () => void;
  /**
   * Track that an ad with the given ID was clicked
   */
  trackAdClick: (adId: string) => void;
  /**
   * Track that an ad with the given ID was shown
   */
  trackAdImpression: (adId: string) => void;
  /**
   * Array of ad IDs that have been clicked in the current session
   */
  clickedAds: string[];
}

/**
 * Hook to manage ad-related functionality across the application
 */
export function useAds({
  initialEnabled = true,
  storageKey = 'ads_preferences',
  persistPreferences = true,
}: UseAdsOptions = {}): UseAdsReturn {
  // Load initial state from localStorage if persistence is enabled
  const getInitialState = () => {
    if (typeof globalThis === 'undefined') {
      return initialEnabled;
    }

    if (!persistPreferences) {
      return initialEnabled;
    }

    try {
      const savedPreference = localStorage.getItem(storageKey);

      if (savedPreference !== null) {
        const parsed = JSON.parse(savedPreference);
        return parsed.enabled;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return initialEnabled;
  };

  // Always enable ads for now to troubleshoot
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [clickedAds, setClickedAds] = useState<string[]>([]);

  // Persist preferences to localStorage when they change
  useEffect(() => {
    if (typeof globalThis === 'undefined' || !persistPreferences) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify({ enabled: adsEnabled }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [adsEnabled, persistPreferences, storageKey]);

  // Toggle ads on/off
  const toggleAds = useCallback(() => {
    setAdsEnabled(previous => !previous);
  }, []);

  // Explicitly enable ads
  const enableAds = useCallback(() => {
    setAdsEnabled(true);
  }, []);

  // Explicitly disable ads
  const disableAds = useCallback(() => {
    setAdsEnabled(false);
  }, []);

  // Reset shown ads for the current session
  const resetShownAds = useCallback(() => {
    if (typeof globalThis === 'undefined') return;
    sessionStorage.removeItem('adShown');
  }, []);

  // Track that an ad was clicked
  const trackAdClick = useCallback((adId: string) => {
    setClickedAds(previous => {
      if (previous.includes(adId)) return previous;
      return [...previous, adId];
    });
  }, []);

  // Track that an ad was shown
  const trackAdImpression = useCallback((adId: string) => {
    // TODO: Implement ad impression tracking
  }, []);

  return {
    adsEnabled,
    toggleAds,
    enableAds,
    disableAds,
    resetShownAds,
    trackAdClick,
    trackAdImpression,
    clickedAds,
  };
}
