import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import { DriverOrderDto } from '@/core/dtos/driver/DriverDto';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
interface DriverRunningOrderListProps {
  driverId: number;
  status?: number;
  showFilter?: boolean;
  perPage?: number;
}

// Constants
const ORDERS_PER_PAGE = 2;
const OBSERVER_THRESHOLD = 0.5;

// Custom Hook - Based on MerchantOrderList approach
const useDriverOrderList = (
  driverId: number,
  status?: number,
  perPage?: number
) => {
  const [orders, setOrders] = useState<DriverOrderDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);
  const t = useTranslations('application.driver_order_list');

  const orderService = useMemo(
    () => new OrderService(new OrderRepository(new AxiosCustomClient())),
    []
  );

  const fetchOrders = useCallback(
    async ({
      page,
      perPage,
      signal,
    }: {
      page: number;
      perPage: number;
      signal?: AbortSignal;
    }) => {
      try {
        setIsLoading(true);
        setError(undefined);

        // Create request params object
        const requestParams: any = {
          driver_id: driverId,
          page: page,
          per_page: perPage,
        };

        // Only include delivery_status if status is provided
        if (status !== undefined) {
          requestParams.delivery_status = status;
        }

        const result = await orderService.getDriverOrderList(requestParams);

        const newItems = result?.order_items || [];

        setOrders(previous =>
          page === 1 ? newItems : [...previous, ...newItems]
        );
        setHasMore(newItems.length >= perPage);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(
            error instanceof Error ? error.message : t('failedToFetchOrders')
          );
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [orderService, driverId, status, t]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders({
      page,
      perPage: perPage ?? ORDERS_PER_PAGE,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [page, fetchOrders, perPage]);

  const fetchNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(previous => previous + 1);
    }
  }, [hasMore, isLoading]);

  const refresh = useCallback(() => {
    setOrders([]);
    setPage(1);
    setHasMore(true);
    setError(undefined);
  }, []);

  return {
    orders,
    isLoading,
    hasMore,
    error,
    page,
    fetchNextPage,
    refresh,
  };
};

const DriverRunningOrderList: React.FC<DriverRunningOrderListProps> = ({
  driverId,
  status,
  perPage = ORDERS_PER_PAGE,
  showFilter = false,
}) => {
  const t = useTranslations('application.driver_order_list');
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    orders: orderItems,
    isLoading,
    hasMore,
    error,
    page,
    fetchNextPage,
    refresh: handleRefresh,
  } = useDriverOrderList(driverId, status, perPage);

  // Set up intersection observer for infinite scrolling - exactly like MerchantOrderList
  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log('Intersection observer triggered - loading next page');
          fetchNextPage();
        }
      },
      { root: scrollableRef.current, threshold: OBSERVER_THRESHOLD }
    );

    const target = observerRef.current;
    if (target) {
      console.log('Observer attached to target');
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoading, fetchNextPage]);

  // Loading state
  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>{t('loadingOrders')}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-red-500">
        <p>{t('failedToLoadOrders')}</p>
        <p className="text-sm mt-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  // Empty state
  if (orderItems.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>{t('noOrdersAvailable')}</p>
      </div>
    );
  }

  // Render content
  return (
    <div
      ref={scrollableRef}
      className="p-4 h-[92dvh] w-full overflow-y-auto scrollbar-none relative pb-3 bg-gray-50"
    >
      <div className="space-y-4">
        {/* <div className="sticky top-0 bg-gray-50 z-10 py-2 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {t('showingOrders', { count: orderItems.length, page })}
          </p>
          <button
            onClick={handleRefresh}
            className="text-sm text-orange-500 hover:text-orange-700"
          >
            {t('refresh')}
          </button>
        </div> */}

        <AnimatePresence mode="wait">
          {orderItems.map((order: DriverOrderDto, index: number) => (
            <motion.div
              key={`${order.order_id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {t('orderNumber', { number: order.order_no || 'N/A' })} (
                  {t('id')}: {order.order_id})
                </h3>
                <span className="bg-orange-100 text-orange-800 text-sm text-center px-2 py-1 rounded">
                  {order.delivery_status === 1
                    ? t('orderPreparing')
                    : order.delivery_status === 2
                      ? t('deliveryPreparing')
                      : order.delivery_status === 3
                        ? t('deliverySending')
                        : order.delivery_status === 4
                          ? t('customerAccepted')
                          : t('unknownStatus')}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  {t('orderDate')}:{' '}
                  {order.order_date
                    ? new Date(order.order_date).toLocaleDateString()
                    : t('notAvailable')}
                </p>
                <p>
                  {t('voucher')}: {order.voucher_no || t('notAvailable')}
                </p>
                <p>
                  {t('pickup')}: {order.merchant_name || t('notAvailable')}
                </p>
                <p>
                  {t('driver')}: {order.driver_name || t('notAvailable')}
                </p>
                <p>
                  {t('contact')}:{' '}
                  {order.driver_contact_number || t('notAvailable')}
                </p>
                <p>
                  {t('total')}: {order.order_total || t('notAvailable')}
                </p>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm">
                  <Link
                    className="w-full"
                    href={`/application/driver-order-detail/${order.order_id}`}
                  >
                    {t('viewDetails')}
                  </Link>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator for next page - exactly like MerchantOrderList */}
        {hasMore && (
          <div ref={observerRef} className="flex w-full justify-center my-4">
            <ProductScrollLoader color="#FE8C00" size={8} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRunningOrderList;
