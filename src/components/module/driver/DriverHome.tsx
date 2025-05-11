'use client';

import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Package, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useGetDriverDailyCompletedOrderCount } from '@/lib/hooks/service/order/useGetDriverDailyCompletedOrderCount';
import { useGetDriverOrderListCount } from '@/lib/hooks/service/order/useGetDriverOrderListCount';
import { useGetOrderListCount } from '@/lib/hooks/service/order/useGetOrderListCount';
import { useSession } from '@/lib/hooks/session/useSession';

import DriverDeliveryPreview from './DriverDeliveryPreview';
import DriverRunningOrderList from './DriverRunningOrderList';
// Memoize the DriverRunningOrderList component to prevent unnecessary re-renders
const MemoizedDriverRunningOrderList = memo(DriverRunningOrderList);
const MemoizedDriverDeliveryPreview = memo(DriverDeliveryPreview);

function DriverHome() {
  const t = useTranslations('application.driver_home');
  const { data: sessionData } = useSession();
  const driverId = sessionData?.user?.driver_id;

  // State for API errors
  const [apiError, setApiError] = useState<string | undefined>();

  // Fetch running orders (status: 2) and order requests (status: 1) counts
  // Using merchant_id as a workaround until a driver-specific API is available
  const {
    data: runningOrdersData,
    error: runningOrdersError,
    isLoading: runningOrdersLoading,
  } = useGetDriverOrderListCount(
    {
      driver_id: driverId, // Using merchant_id as a placeholder for driver_id
      delivery_status: 3,
    },
    {
      enabled: !!driverId,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const {
    data: orderRequestsData,
    error: orderRequestsError,
    isLoading: orderRequestsLoading,
  } = useGetDriverOrderListCount(
    {
      driver_id: driverId, // Using merchant_id as a placeholder for driver_id
      delivery_status: 1,
    },
    {
      enabled: !!driverId,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const {
    data: acceptedOrderCount,
    error: acceptedOrderCountError,
    isLoading: acceptedOrderCountLoading,
  } = useGetDriverOrderListCount(
    {
      driver_id: driverId, // Using merchant_id as a placeholder for driver_id
      delivery_status: 2,
    },
    {
      enabled: !!driverId,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  const {
    data: dailyCompletedOrderCount,
    error: dailyCompletedOrderCountError,
    isLoading: dailyCompletedOrderCountLoading,
  } = useGetDriverDailyCompletedOrderCount(
    { driver_id: driverId ?? 0 },
    {
      enabled: !!driverId,
      // staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 2,
      // Add a default value in case the query returns undefined
      // select: data => data ?? 0,
    }
  );

  console.log('dailyCompletedOrderCount', dailyCompletedOrderCount);

  // Handle API errors with useEffect
  useEffect(() => {
    if (runningOrdersError) {
      console.error('Failed to fetch running orders:', runningOrdersError);
      setApiError(t('errorFetchingActiveDeliveries'));
    } else if (orderRequestsError) {
      console.error('Failed to fetch order requests:', orderRequestsError);
      setApiError(t('errorFetchingDeliveryRequests'));
    } else if (dailyCompletedOrderCountError) {
      console.error(
        'Failed to fetch daily completed order count:',
        dailyCompletedOrderCountError
      );
      // Don't set API error for this as it's not critical for the UI
    } else if (acceptedOrderCountError) {
      console.error(
        'Failed to fetch accepted order count:',
        acceptedOrderCountError
      );
      // Don't set API error for this as it's not critical for the UI
    } else {
      setApiError(undefined);
    }
  }, [
    runningOrdersError,
    orderRequestsError,
    dailyCompletedOrderCountError,
    acceptedOrderCountError,
    t,
  ]);

  // Get current location
  const [address, setAddress] = useState<any>();
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | undefined>();

  const fetchLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      setLocationLoading(true);
      setLocationError(undefined);

      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          const data = await response.json();
          setAddress(data);
          setLocationLoading(false);
        }
        // error => {
        //   setLocationError(error.message);
        //   setLocationLoading(false);
        //   console.error('Geolocation error:', error);
        // },
        // { timeout: 10_000, maximumAge: 60_000 }
      );
    }
  }, []);

  // Fetch location on initial load
  useEffect(() => {
    if (!address && !locationLoading) {
      fetchLocation();
    }
  }, [address, locationLoading, fetchLocation]);

  // Handle manual refresh of location
  const handleLocationRefresh = useCallback(() => {
    setAddress(undefined);
    fetchLocation();
  }, [fetchLocation]);

  // Handle refresh of orders
  const handleOrdersRefresh = useCallback(() => {
    // This would trigger a refetch of order data in a real implementation
    // For this example, just clear the API error if any
    setApiError(undefined);
  }, []);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 font-sans">
      {apiError && (
        <div className="bg-red-100 text-red-700 p-3 text-center">
          {apiError}
          <button onClick={handleOrdersRefresh} className="ml-2 underline">
            {t('retry')}
          </button>
        </div>
      )}

      <motion.div
        className="w-full mx-auto bg-white shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <motion.div variants={itemVariants}>
            <div className="flex gap-x-1">
              <span className="text-orange-700">{t('currentLocation')}</span>
              <ChevronDown stroke="#c2410c" />
            </div>
            <div className="flex flex-col">
              {locationLoading && (
                <span className="text-gray-500">{t('loading')}</span>
              )}
              {locationError && (
                <span className="text-red-500 text-sm">
                  {t('locationError')}
                </span>
              )}
              {address && !locationLoading && !locationError && (
                <>
                  <span className="text-black text-[0.9rem] font-[500]">
                    {`${address?.address?.quarter || ''}, ${address?.address?.suburb || ''}`}
                  </span>
                  <span className="text-black text-[0.7rem] font-[400]">
                    {`${address?.address?.city || ''}, ${address?.address?.country || ''}`}
                  </span>
                </>
              )}
              {!address && !locationLoading && !locationError && (
                <span>--</span>
              )}
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Avatar>
              <AvatarImage src={sessionData?.user?.image} />
              <AvatarFallback>
                {sessionData?.user?.name?.toString().slice(0, 1) || 'D'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>

        {/* Orders and Requests Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Drawer>
            <DrawerTrigger asChild>
              <motion.div
                variants={itemVariants}
                className="bg-orange-50 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-100 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-3xl font-bold text-orange-600">
                  {runningOrdersLoading
                    ? '...'
                    : (runningOrdersData?.toString().padStart(2, '0') ?? '00')}
                </h3>
                <p className="text-gray-600 font-bold font-poppins text-[1.3rem]">
                  {t('activeDeliveries')}
                </p>
              </motion.div>
            </DrawerTrigger>
            <DrawerContent className="min-h-[60dvh] h-[60dvh]">
              <DrawerTitle className="flex w-full items-center justify-center pb-2">
                {t('activeDeliveriesList', {
                  count: runningOrdersData?.toString().padStart(2, '0') ?? '00',
                })}
              </DrawerTitle>
              <MemoizedDriverRunningOrderList
                driverId={driverId}
                status={3}
                showFilter={false}
              />
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger asChild>
              <motion.div
                variants={itemVariants}
                className="bg-blue-50 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-100 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-3xl font-bold text-blue-600">
                  {orderRequestsLoading
                    ? '...'
                    : (orderRequestsData?.toString().padStart(2, '0') ?? '00')}
                </h3>
                <p className="text-gray-600 font-bold font-poppins text-[1.3rem]">
                  {t('deliveryRequests')}
                </p>
              </motion.div>
            </DrawerTrigger>
            <DrawerContent className="min-h-[60dvh] h-[60dvh]">
              <DrawerTitle className="flex w-full items-center justify-center pb-2">
                {t('deliveryRequestsList', {
                  count: orderRequestsData?.toString().padStart(2, '0') ?? '00',
                })}
              </DrawerTitle>
              <MemoizedDriverRunningOrderList
                driverId={driverId}
                status={1}
                showFilter={false}
              />
            </DrawerContent>
          </Drawer>
        </div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-6 mb-6"
        >
          <motion.div
            className="bg-green-50 rounded-xl p-6 text-center hover:bg-green-100 transition-colors duration-300 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-green-500 text-sm mb-1">{t('today')}</span>
              <h3 className="text-3xl font-bold text-green-600">
                {dailyCompletedOrderCountLoading
                  ? '...'
                  : dailyCompletedOrderCount !== undefined &&
                      dailyCompletedOrderCount !== null
                    ? dailyCompletedOrderCount.toString().padStart(2, '0')
                    : '00'}
              </h3>
              <p className="text-gray-600 font-medium text-sm mt-1">
                {t('completedDeliveries')}
              </p>
            </div>
          </motion.div>

          <Drawer>
            <DrawerTrigger asChild>
              <motion.div
                variants={itemVariants}
                className="bg-blue-50 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-100 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-3xl font-bold text-blue-600">
                  {acceptedOrderCountLoading
                    ? '...'
                    : (acceptedOrderCount?.toString().padStart(2, '0') ?? '00')}
                </h3>
                <p className="text-gray-600 font-bold font-poppins text-[1.3rem]">
                  {t('acceptedRequests')}
                </p>
              </motion.div>
            </DrawerTrigger>
            <DrawerContent className="min-h-[60dvh] h-[60dvh]">
              <DrawerTitle className="flex w-full items-center justify-center pb-2">
                {t('acceptedRequestsList', {
                  count:
                    acceptedOrderCount?.toString().padStart(2, '0') ?? '00',
                })}
              </DrawerTitle>
              <MemoizedDriverRunningOrderList
                driverId={driverId}
                status={2}
                showFilter={false}
              />
            </DrawerContent>
          </Drawer>
        </motion.div>

        {/* Delivery Preview Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md mb-6"
        >
          <MemoizedDriverDeliveryPreview driverId={driverId} />
        </motion.div>

        {/* Quick Actions */}
        {/* <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-md mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleLocationRefresh}
              disabled={locationLoading}
              className="flex flex-col items-center justify-center bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors disabled:opacity-50"
            >
              <span className="text-orange-500 text-2xl mb-2">
                <MapPin
                  size={24}
                  className={locationLoading ? 'animate-pulse' : ''}
                />
              </span>
              <span className="text-gray-700 text-sm">{t('updateLocation')}</span>
            </button>

            <button
              onClick={handleOrdersRefresh}
              disabled={runningOrdersLoading || orderRequestsLoading}
              className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <span className="text-blue-500 text-2xl mb-2">
                <RefreshCw
                  size={24}
                  className={
                    runningOrdersLoading || orderRequestsLoading
                      ? 'animate-spin'
                      : ''
                  }
                />
              </span>
              <span className="text-gray-700 text-sm">{t('refreshOrders')}</span>
            </button>

            <button className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors">
              <span className="text-green-500 text-2xl mb-2">
                <Package size={24} />
              </span>
              <span className="text-gray-700 text-sm">{t('completeDelivery')}</span>
            </button>
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  );
}

export default DriverHome;
