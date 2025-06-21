import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/lib/redux/ReduxStore';
import {
  fetchExchangeRatesFailure,
  fetchExchangeRatesStart,
  fetchExchangeRatesSuccess,
  selectExchangeRateLastUpdated,
  selectExchangeRateLoading,
} from '@/lib/redux/slices/ExchangeRateSlice';
import { areExchangeRatesRecent } from '@/lib/util/currency-conversion';

import { useGetAllExchangeRate } from './useGetAllExchangeRate';

/**
 * Configuration for exchange rate management
 */
interface ExchangeRateManagerConfig {
  /**
   * Update interval in minutes (default: 30 minutes)
   */
  updateIntervalMinutes?: number;
  /**
   * Maximum age of rates before forcing refresh (default: 45 minutes)
   */
  maxAgeMinutes?: number;
  /**
   * Enable automatic periodic updates (default: true)
   */
  enablePeriodicUpdates?: boolean;
  /**
   * Fetch on mount (default: true)
   */
  fetchOnMount?: boolean;
}

/**
 * Default configuration for exchange rate manager
 */
const DEFAULT_CONFIG: Required<ExchangeRateManagerConfig> = {
  updateIntervalMinutes: 30,
  maxAgeMinutes: 45,
  enablePeriodicUpdates: true,
  fetchOnMount: true,
} as const;

/**
 * Hook to manage exchange rate fetching and periodic updates
 * This hook should be used once at the app level (e.g., in layout or main component)
 */
export const useExchangeRateManager = (config?: ExchangeRateManagerConfig) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const dispatch = useDispatch();

  // Selectors
  const isLoading = useSelector(selectExchangeRateLoading);
  const lastUpdated = useSelector(selectExchangeRateLastUpdated);

  // Refs to track intervals and prevent multiple fetches
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  // Use the exchange rate hook with manual refetch control
  const {
    data: exchangeRateData,
    error: queryError,
    isLoading: queryLoading,
    refetch,
  } = useGetAllExchangeRate({
    enabled: false, // Disable automatic fetching, we'll control it manually
    staleTime: finalConfig.maxAgeMinutes * 60 * 1000, // Consider data stale after maxAge
    gcTime: finalConfig.maxAgeMinutes * 60 * 1000, // Cache for maxAge
  });

  /**
   * Fetch exchange rates using the hook and update Redux store
   */
  const fetchExchangeRates = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current || isLoading) {
      return;
    }

    try {
      isFetchingRef.current = true;
      dispatch(fetchExchangeRatesStart());

      console.log('🔄 Fetching exchange rates...');
      const { data: response, error } = await refetch();

      if (error) {
        throw error;
      }

      if (response) {
        // Log successful fetch
        console.log(
          '✅ Exchange rates fetched successfully:',
          response.data?.length || 0,
          'currencies'
        );

        dispatch(fetchExchangeRatesSuccess(response));

        console.log(
          '✅ Exchange rates updated successfully:',
          response.data?.length || 0,
          'rates'
        );
      } else {
        throw new Error('No data received from exchange rate API');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch exchange rates';
      dispatch(fetchExchangeRatesFailure(errorMessage));
      console.error('❌ Failed to fetch exchange rates:', error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [dispatch, isLoading, refetch]);

  /**
   * Check if rates need to be updated based on age
   */
  const shouldUpdateRates = useCallback(() => {
    return !areExchangeRatesRecent(lastUpdated, finalConfig.maxAgeMinutes);
  }, [lastUpdated, finalConfig.maxAgeMinutes]);

  /**
   * Force refresh exchange rates (ignoring cache)
   */
  const forceRefreshRates = useCallback(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  /**
   * Start periodic updates
   */
  const startPeriodicUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (finalConfig.enablePeriodicUpdates) {
      intervalRef.current = setInterval(
        () => {
          if (shouldUpdateRates()) {
            fetchExchangeRates();
          }
        },
        finalConfig.updateIntervalMinutes * 60 * 1000
      ); // Convert minutes to milliseconds
    }
  }, [
    finalConfig.enablePeriodicUpdates,
    finalConfig.updateIntervalMinutes,
    shouldUpdateRates,
    fetchExchangeRates,
  ]);

  /**
   * Stop periodic updates
   */
  const stopPeriodicUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Effect to handle initial fetch and periodic updates
  useEffect(() => {
    // Initial fetch if needed
    if (finalConfig.fetchOnMount && shouldUpdateRates()) {
      fetchExchangeRates();
    }

    // Start periodic updates
    startPeriodicUpdates();

    // Cleanup on unmount
    return () => {
      stopPeriodicUpdates();
    };
  }, [
    finalConfig.fetchOnMount,
    shouldUpdateRates,
    fetchExchangeRates,
    startPeriodicUpdates,
    stopPeriodicUpdates,
  ]);

  // Effect to restart periodic updates when config changes
  useEffect(() => {
    if (finalConfig.enablePeriodicUpdates) {
      startPeriodicUpdates();
    } else {
      stopPeriodicUpdates();
    }
  }, [
    finalConfig.enablePeriodicUpdates,
    startPeriodicUpdates,
    stopPeriodicUpdates,
  ]);

  // Return manager functions and state
  return {
    isLoading,
    lastUpdated,
    shouldUpdateRates: shouldUpdateRates(),
    forceRefreshRates,
    startPeriodicUpdates,
    stopPeriodicUpdates,
  };
};
