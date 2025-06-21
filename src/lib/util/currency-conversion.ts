import { Currency } from '../redux/slices/CurrencySlice';

/**
 * Base currency for the application (prices from API)
 */
export const BASE_CURRENCY: Currency = 'MMK';

/**
 * Convert price from base currency (MMK) to target currency
 * @param priceInBaseCurrency - Price in MMK (base currency)
 * @param targetCurrency - Target currency to convert to
 * @param exchangeRates - Exchange rates map: ratesMap[currency_code] = rate (where rate = how much MMK equals 1 unit of currency)
 * @returns Converted price or original price if conversion fails
 */
export const convertPrice = (
  priceInBaseCurrency: number,
  targetCurrency: Currency,
  exchangeRates: Record<string, number>
): number => {
  // If target currency is the same as base currency, no conversion needed
  if (targetCurrency === BASE_CURRENCY) {
    return priceInBaseCurrency;
  }

  // Check if we have exchange rate for target currency
  const exchangeRate = exchangeRates[targetCurrency];

  if (!exchangeRate || exchangeRate <= 0) {
    // If no exchange rate available, return original price
    console.warn(
      `❌ No exchange rate found for ${BASE_CURRENCY} to ${targetCurrency}, using original price`
    );
    return priceInBaseCurrency;
  }

  // Convert by DIVIDING (since rate represents: 1 target currency = rate MMK)
  // So: priceInMMK / rate = priceInTargetCurrency
  const convertedPrice = priceInBaseCurrency / exchangeRate;
  const roundedPrice = Math.round(convertedPrice * 100) / 100;

  return roundedPrice;
};

/**
 * Format price with currency symbol
 * @param price - Price to format
 * @param currency - Currency for the price
 * @param currencyInfo - Currency information containing symbols
 * @returns Formatted price string
 */
export const formatPriceWithCurrency = (
  price: number,
  currency: Currency,
  currencyInfo: Record<
    Currency,
    { symbol: string; name: string; flag: string; code: Currency }
  >
): string => {
  const currencyData = currencyInfo[currency];

  if (!currencyData) {
    return price.toLocaleString();
  }

  // Format number with commas
  const formattedPrice = price.toLocaleString();

  // Return formatted price with currency symbol
  return `${currencyData.symbol}${formattedPrice}`;
};

/**
 * Check if exchange rates are available and recent
 * @param lastUpdated - ISO string of last update time
 * @param maxAgeInMinutes - Maximum age in minutes (default: 30 minutes)
 * @returns Whether rates are recent enough
 */
export const areExchangeRatesRecent = (
  lastUpdated: string | null,
  maxAgeInMinutes: number = 30
): boolean => {
  if (!lastUpdated) {
    return false;
  }

  try {
    const lastUpdatedTime = new Date(lastUpdated).getTime();
    const currentTime = Date.now();
    const ageInMinutes = (currentTime - lastUpdatedTime) / (1000 * 60);

    return ageInMinutes <= maxAgeInMinutes;
  } catch (error) {
    console.error('Error checking exchange rate age:', error);
    return false;
  }
};

/**
 * Get all available conversion rates from MMK to other currencies
 * @param exchangeRates - Exchange rates map
 * @returns Object with target currencies as keys and rates as values
 */
export const getAvailableRatesFor = (
  exchangeRates: Record<string, number>
): Record<Currency, number> => {
  const availableRates: Record<Currency, number> = {} as Record<
    Currency,
    number
  >;

  Object.entries(exchangeRates).forEach(([currency, rate]) => {
    if (currency as Currency) {
      availableRates[currency as Currency] = rate;
    }
  });

  return availableRates;
};
