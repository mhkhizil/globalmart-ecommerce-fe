import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/redux/ReduxStore';
import { Currency, currencyInfo } from '@/lib/redux/slices/CurrencySlice';
import { selectExchangeRatesMap } from '@/lib/redux/slices/ExchangeRateSlice';
import {
  BASE_CURRENCY,
  convertPrice,
  formatPriceWithCurrency,
} from '@/lib/util/currency-conversion';

/**
 * Hook to get converted price based on selected currency and exchange rates
 * This hook provides both the converted price and formatted price string
 */
export const useConvertedPrice = (originalPrice: number) => {
  // Get selected currency from Redux
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );

  // Get exchange rates from Redux
  const exchangeRatesMap = useSelector(selectExchangeRatesMap);

  // Memoized converted price
  const convertedPrice = useMemo(() => {
    if (!originalPrice || originalPrice <= 0) {
      return 0;
    }

    return convertPrice(originalPrice, selectedCurrency, exchangeRatesMap);
  }, [originalPrice, selectedCurrency, exchangeRatesMap]);

  // Memoized formatted price string
  const formattedPrice = useMemo(() => {
    return formatPriceWithCurrency(
      convertedPrice,
      selectedCurrency,
      currencyInfo
    );
  }, [convertedPrice, selectedCurrency]);

  // Check if conversion was successful (different from original price or same currency)
  const isConverted = useMemo(() => {
    return (
      selectedCurrency !== BASE_CURRENCY && convertedPrice !== originalPrice
    );
  }, [selectedCurrency, convertedPrice, originalPrice]);

  return {
    /**
     * Original price in base currency (MMK)
     */
    originalPrice,
    /**
     * Converted price in selected currency
     */
    convertedPrice,
    /**
     * Formatted price string with currency symbol
     */
    formattedPrice,
    /**
     * Selected currency code
     */
    currency: selectedCurrency,
    /**
     * Currency information (symbol, name, flag)
     */
    currencyInfo: currencyInfo[selectedCurrency],
    /**
     * Whether the price was successfully converted
     */
    isConverted,
    /**
     * Whether the price is in the base currency
     */
    isBaseCurrency: selectedCurrency === BASE_CURRENCY,
  };
};

/**
 * Hook to get multiple converted prices at once
 * Useful for components that display multiple prices
 */
export const useConvertedPrices = (prices: number[]) => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );
  const exchangeRatesMap = useSelector(selectExchangeRatesMap);

  const convertedPrices = useMemo(() => {
    return prices.map(price => {
      if (!price || price <= 0) {
        return {
          originalPrice: price,
          convertedPrice: 0,
          formattedPrice: formatPriceWithCurrency(
            0,
            selectedCurrency,
            currencyInfo
          ),
          currency: selectedCurrency,
          currencyInfo: currencyInfo[selectedCurrency],
          isConverted: false,
          isBaseCurrency: selectedCurrency === BASE_CURRENCY,
        };
      }

      const convertedPrice = convertPrice(
        price,
        selectedCurrency,
        exchangeRatesMap
      );
      const formattedPrice = formatPriceWithCurrency(
        convertedPrice,
        selectedCurrency,
        currencyInfo
      );
      const isConverted =
        selectedCurrency !== BASE_CURRENCY && convertedPrice !== price;

      return {
        originalPrice: price,
        convertedPrice,
        formattedPrice,
        currency: selectedCurrency,
        currencyInfo: currencyInfo[selectedCurrency],
        isConverted,
        isBaseCurrency: selectedCurrency === BASE_CURRENCY,
      };
    });
  }, [prices, selectedCurrency, exchangeRatesMap]);

  return {
    convertedPrices,
    currency: selectedCurrency,
    currencyInfo: currencyInfo[selectedCurrency],
    isBaseCurrency: selectedCurrency === BASE_CURRENCY,
  };
};

/**
 * Hook to get price conversion information without converting
 * Useful for displaying conversion rates or debugging
 */
export const usePriceConversionInfo = () => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );
  const exchangeRatesMap = useSelector(selectExchangeRatesMap);

  const conversionInfo = useMemo(() => {
    const exchangeRate = exchangeRatesMap[selectedCurrency];

    return {
      baseCurrency: BASE_CURRENCY,
      targetCurrency: selectedCurrency,
      exchangeRate: exchangeRate || null,
      isBaseCurrency: selectedCurrency === BASE_CURRENCY,
      hasExchangeRate: !!exchangeRate && exchangeRate > 0,
      currencyInfo: currencyInfo[selectedCurrency],
    };
  }, [selectedCurrency, exchangeRatesMap]);

  return conversionInfo;
};
