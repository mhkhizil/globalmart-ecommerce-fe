'use client';

import { ArrowLeft, ChevronRight, MapPin, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import FallbackImage from '@/components/common/FallbackImage';
import { Button } from '@/components/ui/button';
import { Coupon } from '@/core/dtos/coupon/CouponListResponseDto';
import { useApplyCoupon } from '@/lib/hooks/service/coupon/useApplyCoupon';
import { useGetCouponList } from '@/lib/hooks/service/coupon/useGetCouponList';
import {
  useGetLocation,
  useGetLocationLazy,
  validateCoordinates,
} from '@/lib/hooks/service/location/useGetLocation';
import {
  useSearchLocation,
  validateSearchQuery,
} from '@/lib/hooks/service/location/useSearchLocation';
import { useSession } from '@/lib/hooks/session/useSession';
import { useCart } from '@/lib/hooks/store/useCart';
import { useConvertedPrice } from '@/lib/hooks/store/useConvertedPrice';
import { useShippingAddress } from '@/lib/hooks/store/useShippingAddress';
import { RootState } from '@/lib/redux/ReduxStore';
import { selectExchangeRatesMap } from '@/lib/redux/slices/ExchangeRateSlice';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';
import { convertPrice } from '@/lib/util/currency-conversion';

interface ShoppingBagProps {
  // Optional props can be added here if needed
}

export function ShoppingBag({}: ShoppingBagProps) {
  const router = useRouter();
  const t = useTranslations();
  const { data: session } = useSession();
  const {
    currentAddress,
    deliveryLocation,
    setDeliveryLocation,
    clearDeliveryLocation,
  } = useShippingAddress();
  const {
    items,
    totalPrice,
    totalItems,
    appliedCoupon,
    applyCoupon: applyCouponToCart,
    removeCoupon,
  } = useCart();

  // Coupon state
  const [showCoupons, setShowCoupons] = useState(false);
  const previousCouponRef = useRef(appliedCoupon);
  const [applyingCouponId, setApplyingCouponId] = useState<number | null>(null);

  // Location state
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track if user has interacted
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Location hook for reverse geocoding
  const {
    data: locationData,
    isLoading: isReverseGeocoding,
    error: reverseGeocodingError,
  } = useGetLocationLazy(currentCoords || { lat: 0, lng: 0 }, {
    enabled: !!currentCoords,
  });

  // Location search hook
  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
  } = useSearchLocation(
    { query: searchQuery },
    { enabled: !!searchQuery && searchQuery.trim().length >= 2 }
  );

  // Currency conversion
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );
  const exchangeRatesMap = useSelector(selectExchangeRatesMap);
  const totalPriceConverted = useConvertedPrice(totalPrice);
  console.log(currentAddress);

  // Helper function to extract place name from location data
  const extractPlaceName = useCallback((locationData: any) => {
    if (locationData.locality) return locationData.locality;
    if (locationData.administrative_area_level_2)
      return locationData.administrative_area_level_2;
    if (locationData.administrative_area_level_1)
      return locationData.administrative_area_level_1;
    if (locationData.route && locationData.street_number) {
      return `${locationData.street_number} ${locationData.route}`;
    }
    if (locationData.route) return locationData.route;
    return 'Current Location';
  }, []);

  // Fetch available coupons
  const { data: couponData, isLoading: couponsLoading } = useGetCouponList();

  // Apply coupon mutation
  const { mutateAsync: applyCoupon, isPending: applyingCoupon } =
    useApplyCoupon({
      onSuccess: response => {
        const discount = Number(response.data.discount);
        toast.success(response.message);
        setShowCoupons(false);
        setApplyingCouponId(null);
      },
      onError: error => {
        toast.error('Failed to apply coupon. Please try again.');
        console.error('Apply coupon error:', error);
        setApplyingCouponId(null);
      },
    });

  // Function to get current location
  const getCurrentLocation = useCallback(() => {
    setHasUserInteracted(true); // Mark that user has interacted
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(t('shoppingBag.geolocationNotSupported'));
      setIsGettingLocation(false);
      toast.error(t('shoppingBag.geolocationNotSupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        // Validate coordinates
        const validation = validateCoordinates(latitude, longitude);
        if (!validation.valid) {
          setLocationError(validation.error || 'Invalid coordinates');
          setIsGettingLocation(false);
          toast.error(validation.error || 'Invalid coordinates');
          return;
        }

        // Set coordinates to trigger the location hook
        setCurrentCoords({ lat: latitude, lng: longitude });
      },
      error => {
        let errorMessage = t('shoppingBag.unableToRetrieveLocation');

        switch (error.code) {
          case error.PERMISSION_DENIED: {
            errorMessage = t('shoppingBag.locationAccessDenied');
            break;
          }
          case error.POSITION_UNAVAILABLE: {
            errorMessage = t('shoppingBag.locationUnavailable');
            break;
          }
          case error.TIMEOUT: {
            errorMessage = t('shoppingBag.locationTimeout');
            break;
          }
        }

        setLocationError(errorMessage);
        setIsGettingLocation(false);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 300_000, // 5 minutes
      }
    );
  }, [t]);

  // Handle location data from the hook
  useEffect(() => {
    if (locationData && currentCoords) {
      const locationInfo = {
        latitude: currentCoords.lat,
        longitude: currentCoords.lng,
        address: locationData.formatted_address,
        placeName: extractPlaceName(locationData),
      };

      // Save to Redux store
      setDeliveryLocation(locationInfo);
      toast.success(t('shoppingBag.locationCapturedSuccess'));
      setShowLocationSearch(false); // Close the collapsible card
      setIsGettingLocation(false);
      setCurrentCoords(null); // Reset coordinates
    }
  }, [locationData, currentCoords, setDeliveryLocation, t, extractPlaceName]);

  // Handle location errors from the hook
  useEffect(() => {
    if (reverseGeocodingError && currentCoords) {
      console.error('Reverse geocoding error:', reverseGeocodingError);

      // Fallback to coordinates if reverse geocoding fails
      const fallbackLocationData = {
        latitude: currentCoords.lat,
        longitude: currentCoords.lng,
        address: `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`,
        placeName: 'Current Location',
      };

      // Save to Redux store
      setDeliveryLocation(fallbackLocationData);
      toast.success(t('shoppingBag.locationCapturedSuccess'));
      setShowLocationSearch(false); // Close the collapsible card
      setIsGettingLocation(false);
      setCurrentCoords(null); // Reset coordinates
    }
  }, [reverseGeocodingError, currentCoords, setDeliveryLocation, t]);

  // Handle location selection from search results
  const handleLocationSelect = useCallback(
    (location: any) => {
      // Validate coordinates before using them
      const validation = validateCoordinates(
        location.latitude,
        location.longitude
      );
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid location coordinates');
        return;
      }

      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.formatted,
        placeName:
          location.components?.neighbourhood ||
          location.components?.suburb ||
          location.components?.city_district ||
          location.components?.city ||
          location.components?.town ||
          location.components?.village ||
          'Selected Location',
      };

      // Mark that user has interacted with location selection
      setHasUserInteracted(true);
      setDeliveryLocation(locationData);
      setShowLocationSearch(false); // Close the collapsible card
      setSearchQuery(''); // Clear search query
      toast.success(t('shoppingBag.locationSelectedSuccess'));
    },
    [setDeliveryLocation, t]
  );

  // Clear current location
  const handleClearLocation = useCallback(() => {
    clearDeliveryLocation();
    setLocationError(null);
    setHasUserInteracted(false); // Reset interaction state to show default address
    setCurrentCoords(null); // Clear coordinates
  }, [clearDeliveryLocation]);

  // Show location search modal
  const handleShowLocationSearch = useCallback(() => {
    setShowLocationSearch(true);
    setSearchQuery(''); // Clear search query - hook will handle results
  }, []);

  // Close location search
  const handleCloseLocationSearch = useCallback(() => {
    setShowLocationSearch(false);
    setSearchQuery(''); // Clear search query - hook will automatically clear results
    setLocationError(null);
    setCurrentCoords(null); // Clear coordinates
    setIsGettingLocation(false); // Reset getting location state
  }, []);

  // Calculate totals with currency conversion
  const subtotal: number = totalPriceConverted.convertedPrice || 0;
  const deliveryFee: number = 0; // Free delivery
  const couponDiscount = appliedCoupon
    ? convertPrice(
        appliedCoupon.discount_amount,
        selectedCurrency,
        exchangeRatesMap
      )
    : 0;
  const total: number = subtotal + deliveryFee - couponDiscount;

  // Monitor coupon changes and notify user if coupon is removed due to cart changes
  useEffect(() => {
    const previousCoupon = previousCouponRef.current;

    if (previousCoupon && !appliedCoupon) {
      // Coupon was removed, check if it was due to minimum order requirement
      const currentTotal = subtotal + deliveryFee;
      const minOrderAmount = Number(previousCoupon.min_order_amount);

      if (currentTotal < minOrderAmount) {
        toast.error(
          `Coupon ${previousCoupon.coupon_code} removed. Minimum order amount of $${minOrderAmount} required.`,
          { duration: 4000 }
        );
      }
    } else if (
      previousCoupon &&
      appliedCoupon &&
      previousCoupon.discount_type === 'percentage' &&
      Math.abs(previousCoupon.discount_amount - appliedCoupon.discount_amount) >
        0.01
    ) {
      // Percentage-based coupon discount has changed
      toast.success(
        `Coupon discount updated to $${appliedCoupon.discount_amount.toFixed(2)} based on cart total.`,
        { duration: 3000 }
      );
    }

    previousCouponRef.current = appliedCoupon;
  }, [appliedCoupon, subtotal, deliveryFee]);

  // Calculate discount information for an item
  const calculateItemDiscount = useCallback(
    (item: any) => {
      if (!item.type || (!item.discount_percent && !item.discount_amount)) {
        return {
          hasDiscount: false,
          originalPrice: item.price,
          discountLabel: '',
          savings: 0,
        };
      }

      let originalPrice = item.price;
      let discountLabel = '';

      if (item.type === 'percentage' && item.discount_percent) {
        originalPrice = item.price / (1 - item.discount_percent / 100);
        discountLabel = `${item.discount_percent}% off`;
      } else if (item.type === 'fixed' && item.discount_amount) {
        originalPrice = item.price + Number(item.discount_amount);
        const convertedDiscountAmount = convertPrice(
          Number(item.discount_amount),
          selectedCurrency,
          exchangeRatesMap
        );
        discountLabel = `${totalPriceConverted.currencyInfo.symbol}${convertThousandSeparator(convertedDiscountAmount, totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2)} off`;
      }

      const savings = (originalPrice - item.price) * item.quantity;
      const convertedSavings = convertPrice(
        savings,
        selectedCurrency,
        exchangeRatesMap
      );

      return {
        hasDiscount: true,
        originalPrice,
        discountLabel,
        savings: convertedSavings,
      };
    },
    [selectedCurrency, exchangeRatesMap, totalPriceConverted.currencyInfo]
  );

  // Generate mock variations for display (in real app, this would come from product data)
  const getMockVariations = useCallback((itemId: number) => {
    const variations = [
      { Black: true, Red: false },
      { Green: true, Grey: false },
      { Blue: true, White: false },
      { Navy: true, Beige: false },
    ];
    return variations[itemId % variations.length];
  }, []);

  // Generate mock rating for display (in real app, this would come from product data)
  const getMockRating = useCallback((itemId: number) => {
    const ratings = [4.8, 4.7, 4.5, 4.9, 4.6];
    return ratings[itemId % ratings.length];
  }, []);

  // Coupon handling functions
  const handleSelectCoupon = useCallback(
    async (coupon: Coupon) => {
      try {
        setApplyingCouponId(coupon.id);
        const orderTotal = subtotal + deliveryFee;
        const convertedMinOrderAmount = convertPrice(
          Number(coupon.min_order_amount),
          selectedCurrency,
          exchangeRatesMap
        );

        // Check minimum order amount
        if (orderTotal < convertedMinOrderAmount) {
          toast.error(
            `Minimum order amount of ${totalPriceConverted.currencyInfo.symbol}${convertedMinOrderAmount.toFixed(totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2)} required for this coupon.`
          );
          setApplyingCouponId(null);
          return;
        }

        // Apply the coupon via API
        const response = await applyCoupon({
          coupon_code: coupon.coupon_code,
          order_total: orderTotal,
        });

        // Create AppliedCoupon object for cart state
        const appliedCouponData = {
          id: coupon.id,
          coupon_code: coupon.coupon_code,
          discount_amount: Number(response.data.discount),
          discount_type: coupon.discount_type,
          discount_percent: coupon.discount_percent || undefined,
          min_order_amount: coupon.min_order_amount,
        };

        // Apply to cart state
        applyCouponToCart(appliedCouponData);
      } catch (error) {
        console.error('Error applying coupon:', error);
        setApplyingCouponId(null);
      }
    },
    [
      subtotal,
      deliveryFee,
      applyCoupon,
      applyCouponToCart,
      selectedCurrency,
      exchangeRatesMap,
      totalPriceConverted.currencyInfo,
    ]
  );

  const handleRemoveCoupon = useCallback(() => {
    removeCoupon();
    toast.success('Coupon removed');
  }, [removeCoupon]);

  const handleShowCoupons = useCallback(() => {
    setShowCoupons(true);
  }, []);

  const handleProceedToPayment = () => {
    // Navigate to payment page
    router.push('/application/customer-payment-selection');
  };

  // If cart is empty, redirect back to cart
  if (items.length === 0) {
    router.push('/application/cart');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={() => router.back()}
          className="p-1"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {t('shoppingBag.checkout')}
        </h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Delivery Address Section */}
        <div className="bg-white p-4 mb-2 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin size={18} className="text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {t('shoppingBag.deliveryAddress')}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {hasUserInteracted && deliveryLocation ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        GPS Location
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Saved Address
                      </span>
                    )}
                  </div>
                </div>

                {hasUserInteracted && deliveryLocation ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="font-medium text-green-700 text-sm">
                        {deliveryLocation.placeName ||
                          t('shoppingBag.currentLocationSelected')}
                      </p>
                    </div>
                    <div className="pl-4 space-y-1">
                      <p className="text-sm text-gray-700">
                        {deliveryLocation.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs">📍</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {deliveryLocation.latitude.toFixed(4)},{' '}
                            {deliveryLocation.longitude.toFixed(4)}
                          </span>
                        </div>
                        {/* <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">
                            Current Location Delivery
                          </span>
                        </div> */}
                      </div>
                      {/* <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs">🚚</span>
                          </div>
                          <span className="text-xs text-gray-600">
                            Est. delivery: 25-35 mins
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-blue-600">
                            Live tracking available
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* <p className="text-sm font-medium text-gray-900">
                          {currentAddress?.fullName }
                        </p> */}
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-700">
                            {currentAddress?.addressLine1 || "216 St Paul's Rd"}
                          </p>
                          {currentAddress?.addressLine2 && (
                            <p className="text-sm text-gray-700">
                              {currentAddress.addressLine2}
                            </p>
                          )}
                          <p className="text-sm text-gray-700">
                            {currentAddress
                              ? `${currentAddress.city}, ${currentAddress.state} ${currentAddress.zipCode}`
                              : 'London N1 2LL, UK'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs">📞</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {currentAddress?.phone || '+44-784232'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          {t('shoppingBag.defaultDeliveryAddress')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs">🚚</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          Est. delivery: 30-45 mins
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">
                          Verified address
                        </span>
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 ml-3">
              {hasUserInteracted && deliveryLocation ? (
                <button
                  onClick={handleClearLocation}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label={t('shoppingBag.clearLocation')}
                >
                  <X size={16} />
                </button>
              ) : (
                <button
                  onClick={handleShowLocationSearch}
                  className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center space-x-1"
                  aria-label={t('shoppingBag.searchLocation')}
                >
                  <MapPin size={12} />
                  <span>Change</span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Location Search Card */}
          {showLocationSearch && (
            <div className="mt-4 border-t border-gray-200 pt-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder={t('shoppingBag.searchLocationPlaceholder')}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation || isReverseGeocoding}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium text-sm transition-all"
                  >
                    {isGettingLocation || isReverseGeocoding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>
                          {isGettingLocation
                            ? t('shoppingBag.gettingLocation')
                            : t('shoppingBag.processingLocation') ||
                              'Processing location...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <MapPin size={14} />
                        </div>
                        <span>{t('shoppingBag.useCurrentLocation')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCloseLocationSearch}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                  >
                    <X size={14} />
                    <span className="text-sm">Cancel</span>
                  </button>
                </div>

                {/* Search Results */}
                {(searchResults.length > 0 ||
                  (searchQuery && !isSearching)) && (
                  <div className="border-t border-gray-200 pt-4">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          {t('shoppingBag.searchResults')}
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {searchResults.map((location, index) => (
                            <button
                              key={index}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <MapPin
                                    size={14}
                                    className="text-gray-500 group-hover:text-blue-600"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm truncate">
                                    {location.components?.neighbourhood ||
                                      location.components?.suburb ||
                                      location.components?.city_district ||
                                      location.components?.city ||
                                      location.components?.town ||
                                      location.components?.village ||
                                      'Location'}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {location.formatted}
                                  </p>
                                </div>
                                <ChevronRight
                                  size={16}
                                  className="text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-1"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : searchQuery && !isSearching ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin size={20} className="text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">
                          {t('shoppingBag.noLocationsFound')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t('shoppingBag.tryDifferentSearch')}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Error Display */}
                {(locationError || reverseGeocodingError) && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs">!</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Location Error
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {locationError ||
                            reverseGeocodingError?.message ||
                            'An error occurred while getting location'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shopping List Section */}
        <div className="bg-white p-4 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              {t('shoppingBag.shoppingList')}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="space-y-3">
            {items.map(item => {
              const discountInfo = calculateItemDiscount(item);
              const variations = getMockVariations(item.id);
              const rating = getMockRating(item.id);

              return (
                <div
                  key={item.id}
                  className="flex space-x-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <FallbackImage
                      src={item.image}
                      fallbackSrc="/food-fallback.png"
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {discountInfo.hasDiscount && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                        {discountInfo.discountLabel.includes('%')
                          ? discountInfo.discountLabel.split(' ')[0]
                          : 'SALE'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 text-sm truncate pr-2">
                        {item.name}
                      </h4>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-sm">
                          {totalPriceConverted.currencyInfo.symbol}
                          {convertThousandSeparator(
                            convertPrice(
                              item.price * item.quantity,
                              selectedCurrency,
                              exchangeRatesMap
                            ),
                            totalPriceConverted.currencyInfo.code === 'MMK'
                              ? 0
                              : 2
                          )}
                        </p>
                        {discountInfo.hasDiscount && (
                          <p className="text-xs text-gray-400 line-through">
                            {totalPriceConverted.currencyInfo.symbol}
                            {convertThousandSeparator(
                              convertPrice(
                                discountInfo.originalPrice * item.quantity,
                                selectedCurrency,
                                exchangeRatesMap
                              ),
                              totalPriceConverted.currencyInfo.code === 'MMK'
                                ? 0
                                : 2
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Compact Details */}
                    <div className="mt-1 space-y-1">
                      {/* Variations - Compact */}
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Variant:</span>
                        <div className="flex space-x-1">
                          {Object.entries(variations)
                            .slice(0, 2)
                            .map(([color, isSelected]) => (
                              <span
                                key={color}
                                className={`px-1.5 py-0.5 text-xs rounded ${
                                  isSelected
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {color}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Rating & Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                className={`w-3 h-3 ${
                                  index < Math.floor(rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {rating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary in Shopping List */}
          <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-4 px-4 py-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">
                {t('shoppingBag.totalOrder')}
              </span>
              <span className="font-bold text-lg text-gray-900">
                {totalPriceConverted.currencyInfo.symbol}{' '}
                {convertThousandSeparator(
                  subtotal,
                  totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Apply Coupons Section */}
        <div className="bg-white p-4 mb-2">
          {appliedCoupon ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-500 text-xs font-bold">✓</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    {appliedCoupon.coupon_code}
                  </span>
                  <p className="text-xs text-gray-500">
                    Saved {totalPriceConverted.currencyInfo.symbol}
                    {convertThousandSeparator(
                      couponDiscount,
                      totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleShowCoupons}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">%</span>
                </div>
                <span className="font-medium text-gray-900">
                  {t('shoppingBag.applyCoupons')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-medium text-sm">
                  {t('shoppingBag.select')}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          )}
        </div>

        {/* Order Payment Details */}
        <div className="bg-white p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Order Payment Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Amounts</span>
              <span className="font-medium">
                {totalPriceConverted.currencyInfo.symbol}{' '}
                {convertThousandSeparator(
                  subtotal,
                  totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Convenience</span>
                <button className="text-blue-500 text-xs underline">
                  Know More
                </button>
              </div>
              <span className="text-gray-600 font-medium text-sm">
                {totalPriceConverted.currencyInfo.symbol} 0.00
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-green-600 font-medium">
                {deliveryFee === 0
                  ? 'Free'
                  : `${totalPriceConverted.currencyInfo.symbol} ${convertThousandSeparator(
                      convertPrice(
                        deliveryFee,
                        selectedCurrency,
                        exchangeRatesMap
                      ),
                      totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
                    )}`}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Coupon Discount</span>
                <span className="text-green-600 font-medium">
                  - {totalPriceConverted.currencyInfo.symbol}{' '}
                  {convertThousandSeparator(
                    couponDiscount,
                    totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
                  )}
                </span>
              </div>
            )}

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Order Total</span>
                <span className="font-bold text-gray-900">
                  {totalPriceConverted.currencyInfo.symbol}{' '}
                  {convertThousandSeparator(
                    total,
                    totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-600 text-sm">EMI Available</span>
              <button className="text-red-500 text-xs underline">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Payment Bar */}
      <div className="bg-white border-t px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900">
              {totalPriceConverted.currencyInfo.symbol}{' '}
              {convertThousandSeparator(
                total,
                totalPriceConverted.currencyInfo.code === 'MMK' ? 0 : 2
              )}
            </span>
            <button className="text-xs text-blue-500 underline text-left">
              View Details
            </button>
          </div>

          <Button
            onClick={handleProceedToPayment}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>

      {/* Coupon Selection Modal */}
      {showCoupons && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Coupons
              </h3>
              <button
                onClick={() => setShowCoupons(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-4">
              {couponsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(index => (
                    <div key={index} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : couponData?.data?.coupon?.length ? (
                <div className="space-y-3">
                  {couponData.data.coupon.map(coupon => {
                    const isEligible =
                      subtotal + deliveryFee >= Number(coupon.min_order_amount);

                    return (
                      <div
                        key={coupon.id}
                        className={`border rounded-lg p-4 ${
                          isEligible
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-bold text-lg text-gray-900">
                                {coupon.coupon_code}
                              </span>
                              {coupon.discount_type === 'percentage' ? (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                  {coupon.discount_percent}% OFF
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                  {totalPriceConverted.currencyInfo.symbol}
                                  {convertThousandSeparator(
                                    convertPrice(
                                      Number(coupon.discount_amount),
                                      selectedCurrency,
                                      exchangeRatesMap
                                    ),
                                    totalPriceConverted.currencyInfo.code ===
                                      'MMK'
                                      ? 0
                                      : 2
                                  )}{' '}
                                  OFF
                                </span>
                              )}
                            </div>

                            {coupon.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {coupon.description}
                              </p>
                            )}

                            <div className="text-xs text-gray-500 space-y-1">
                              <p>
                                Min. order:{' '}
                                {totalPriceConverted.currencyInfo.symbol}
                                {convertThousandSeparator(
                                  convertPrice(
                                    Number(coupon.min_order_amount),
                                    selectedCurrency,
                                    exchangeRatesMap
                                  ),
                                  totalPriceConverted.currencyInfo.code ===
                                    'MMK'
                                    ? 0
                                    : 2
                                )}
                              </p>
                              <p>
                                Valid till:{' '}
                                {new Date(coupon.end_date).toLocaleDateString()}
                              </p>
                              <p>
                                Uses left:{' '}
                                {coupon.valid_count - coupon.use_count}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSelectCoupon(coupon)}
                            disabled={
                              !isEligible || applyingCouponId === coupon.id
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                              isEligible
                                ? 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {applyingCouponId === coupon.id
                              ? 'Applying...'
                              : isEligible
                                ? 'Apply'
                                : 'Not Eligible'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">%</span>
                  </div>
                  <p className="text-gray-500">No coupons available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingBag;
