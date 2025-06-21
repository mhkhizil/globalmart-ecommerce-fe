'use client';

import React from 'react';

import { useExchangeRateManager } from '@/lib/hooks/service/common/useExchangeRateManager';

interface ExchangeRateProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages exchange rates globally
 * This should be placed near the root of the application
 * It initializes periodic exchange rate fetching and management
 */
const ExchangeRateProvider: React.FC<ExchangeRateProviderProps> = ({
  children,
}) => {
  // Initialize exchange rate manager with default configuration
  const exchangeRateManager = useExchangeRateManager({
    updateIntervalMinutes: 30, // Update every 30 minutes
    maxAgeMinutes: 45, // Consider rates stale after 45 minutes
    enablePeriodicUpdates: true, // Enable automatic updates
    fetchOnMount: true, // Fetch rates when component mounts
  });

  // The exchange rate manager handles everything in the background
  // We don't need to render anything special, just pass through children
  return <>{children}</>;
};

export default ExchangeRateProvider;
