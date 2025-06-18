import { useCallback, useMemo } from 'react';

import { formatCurrency, getCurrencySymbol } from '@/lib/util/currency';

import { useCurrency } from './useCurrency';

/**
 * Custom hook for currency formatting that uses the selected currency from Redux store
 */
export const useCurrencyFormatter = () => {
  const { selectedCurrency } = useCurrency();

  // Memoized currency symbol
  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(selectedCurrency);
  }, [selectedCurrency]);

  // Memoized formatter function
  const format = useCallback(
    (amount: number, locale?: string) => {
      return formatCurrency(amount, selectedCurrency, locale);
    },
    [selectedCurrency]
  );

  // Quick formatter for just adding symbol (no decimal formatting)
  const formatSimple = useCallback(
    (amount: number) => {
      return `${currencySymbol}${amount}`;
    },
    [currencySymbol]
  );

  return {
    selectedCurrency,
    currencySymbol,
    format,
    formatSimple,
  };
};
