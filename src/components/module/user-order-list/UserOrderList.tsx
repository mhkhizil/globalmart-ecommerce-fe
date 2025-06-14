'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import OrderDetailCard, {
  OrderStatus,
} from '@/components/module/customer-order/OrderDetailCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerOrderListFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { CustomerOrderListResponseDto } from '@/core/dtos/order/OrderListResponseDto';
import { Order } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { useGetCustomerOrderList } from '@/lib/hooks/service/order/useCustomerOrderList';
import { useSession } from '@/lib/hooks/session/useSession';

// Constants
const ITEMS_PER_PAGE = 10;
const OBSERVER_THRESHOLD = 0.5;

// The status filter options will be created using translations in the component

// Custom hook for order list with infinite scrolling
const useOrderList = (initialStatus: number = -1) => {
  const { data: sessionData } = useSession();
  const customerId = sessionData?.user.id;

  // State for tracking the selected status filter
  const [statusFilter, setStatusFilter] = useState<number>(initialStatus);

  // Create a memoized filter object
  const getFilterParams = useCallback(
    (pageParameter = 1): CustomerOrderListFilterDto => {
      return {
        user_id: customerId as number,
        per_page: ITEMS_PER_PAGE,
        page: pageParameter,
        ...(statusFilter !== -1 && { status: statusFilter + 1 }), // API status is 1-indexed
      };
    },
    [customerId, statusFilter]
  );

  // Use infinite query for pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<CustomerOrderListResponseDto, Error>({
    queryKey: ['customer-orders', statusFilter, customerId],
    queryFn: async ({ pageParam: pageParameter = 1 }) => {
      const orderService = new OrderService(
        new OrderRepository(new AxiosCustomClient())
      );
      return await orderService.getCustomerOrderList(
        getFilterParams(pageParameter as number)
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the page size, there are no more pages
      return lastPage.order.length === ITEMS_PER_PAGE
        ? allPages.length + 1
        : undefined;
    },
    enabled: !!customerId,
  });

  // Flatten the pages of orders into a single array
  const orders = useMemo(() => {
    return data?.pages.flatMap(page => page.order) || [];
  }, [data]);

  // Update status filter
  const updateStatusFilter = useCallback((newStatus: number) => {
    setStatusFilter(newStatus);
  }, []);

  return {
    orders,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    statusFilter,
    updateStatusFilter,
    isError,
    error,
  };
};

function UserOrderList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  // Get initial status from URL or default to "All"
  const initialStatus = useMemo(() => {
    const statusParameter = searchParams?.get('status');
    return statusParameter ? Number.parseInt(statusParameter, 10) : -1;
  }, [searchParams]);

  // Refs for infinite scrolling
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Use our custom hook
  const {
    orders,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    statusFilter,
    updateStatusFilter,
    isError,
    error,
  } = useOrderList(initialStatus);

  // Create status filter options with translations
  const statusFilters = useMemo(
    () => [
      { value: -1, label: t('order.list.allOrders') },
      { value: OrderStatus.PENDING, label: t('order.list.pending') },
      { value: OrderStatus.CONFIRMED, label: t('order.list.confirmed') },
      { value: OrderStatus.SHIPPED, label: t('order.list.shipped') },
      { value: OrderStatus.CANCELLED, label: t('order.list.cancelled') },
      { value: OrderStatus.REJECTED, label: t('order.list.rejected') },
      { value: OrderStatus.COMPLETED, label: t('order.list.completed') },
    ],
    [t]
  );

  // Handle status filter change
  const handleStatusChange = useCallback(
    (status: number) => {
      // Update URL with new status
      const params = new URLSearchParams(searchParams?.toString() || '');

      if (status === -1) {
        params.delete('status');
      } else {
        params.set('status', status.toString());
      }

      router.replace(`?${params.toString()}`, { scroll: false });
      updateStatusFilter(status);
    },
    [router, searchParams, updateStatusFilter]
  );

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollableRef.current,
        threshold: OBSERVER_THRESHOLD,
      }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Filter badge animation variants
  const filterBadgeVariants = {
    selected: {
      scale: 1.05,
      backgroundColor: 'transparent',
      color: 'var(--primary-foreground)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 20,
      },
    },
    unselected: {
      scale: 1,
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 25,
      },
    },
  };

  return (
    <div
      className="h-[92dvh] w-full overflow-y-auto scrollbar-none"
      ref={scrollableRef}
    >
      {/* Status filter section */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold mb-3">{t('order.list.myOrders')}</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {statusFilters.map(filter => (
            <motion.div
              key={filter.value}
              initial="unselected"
              animate={
                statusFilter === filter.value ? 'selected' : 'unselected'
              }
              //variants={filterBadgeVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Badge
                className={`cursor-pointer text-nowrap px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  statusFilter === filter.value
                    ? 'border-primary bg-[#FE8C00] hover:bg-[#FE8C00]'
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => handleStatusChange(filter.value)}
              >
                {filter.label}
              </Badge>
              {statusFilter === filter.value && (
                <motion.div
                  className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0, x: '-50%' }}
                  animate={{ width: '80%', x: '-50%' }}
                  transition={{
                    type: 'spring' as const,
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="p-4">
        {isError && (
          <div className="text-center py-8 text-red-500">
            <p>
              {t('order.list.errorLoading')}: {error?.message}
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => fetchNextPage()}
            >
              {t('order.list.tryAgain')}
            </Button>
          </div>
        )}

        {isLoading && orders.length === 0 ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-32 rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">
              {t('order.list.noOrdersFound')}
            </p>
            <p className="text-sm text-gray-400">
              {statusFilter === -1
                ? t('order.list.placeOrderToSee')
                : t('order.list.tryChangingFilter')}
            </p>
          </div>
        ) : (
          // Order list with animations
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {orders.map((order, index) => (
                <motion.div
                  key={`${order.id}-${index}`}
                  variants={itemVariants}
                  layout
                  className="w-full"
                >
                  <OrderDetailCard order={order} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Loading indicator for next page */}
        {(hasNextPage || isFetchingNextPage) && (
          <div
            ref={observerRef}
            className="py-4 flex justify-center items-center"
          >
            {isFetchingNextPage && (
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrderList;
