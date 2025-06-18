import { Currency, currencyInfo } from '@/lib/redux/slices/CurrencySlice';

/**
 * Format a number as currency with the appropriate symbol and formatting
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param locale - Optional locale for number formatting (defaults to 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: Currency,
  locale: string = 'en-US'
): string => {
  const currencyData = currencyInfo[currency];

  if (!currencyData) {
    console.warn(`Unknown currency: ${currency}`);
    return `${amount}`;
  }

  try {
    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: getDecimalPlaces(currency),
      maximumFractionDigits: getDecimalPlaces(currency),
    });

    return formatter.format(amount);
  } catch {
    // Fallback to manual formatting if Intl fails
    const decimalPlaces = getDecimalPlaces(currency);
    const formattedAmount = amount.toFixed(decimalPlaces);
    return `${currencyData.symbol}${formattedAmount}`;
  }
};

/**
 * Get the number of decimal places for a currency
 * @param currency - The currency code
 * @returns Number of decimal places
 */
export const getDecimalPlaces = (currency: Currency): number => {
  switch (currency) {
    case 'USD':
    case 'CNY':
    case 'THB': {
      return 2;
    }
    case 'MMK': {
      return 0;
    } // Myanmar Kyat typically doesn't use decimals
    default: {
      return 2;
    }
  }
};

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currency: Currency): string => {
  return currencyInfo[currency]?.symbol || currency;
};

/**
 * Get currency name for a given currency code
 * @param currency - The currency code
 * @returns Currency name
 */
export const getCurrencyName = (currency: Currency): string => {
  return currencyInfo[currency]?.name || currency;
};

/**
 * Simple currency conversion placeholder
 * Note: In a real application, you would get exchange rates from an API
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Converted amount (placeholder implementation)
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;

  // Placeholder exchange rates - in production, fetch from a real API
  const exchangeRates: Record<Currency, Record<Currency, number>> = {
    USD: { USD: 1, THB: 35, MMK: 2100, CNY: 7.2 },
    THB: { USD: 0.029, THB: 1, MMK: 60, CNY: 0.21 },
    MMK: { USD: 0.000_48, THB: 0.017, MMK: 1, CNY: 0.0034 },
    CNY: { USD: 0.14, THB: 4.8, MMK: 292, CNY: 1 },
  };

  const rate = exchangeRates[fromCurrency]?.[toCurrency];
  if (!rate) {
    console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    return amount;
  }

  return amount * rate;
};
