'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderFilterDto } from '@/core/dtos/order/OrderFilterDto';
import { OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

import OrderPreviewCard from '../OrderPreviewCard';

// Constants
const ORDERS_PER_PAGE = 10;
const OBSERVER_THRESHOLD = 0.5;
const FETCH_DEBOUNCE_MS = 200;

// Types
interface FetchOrdersOptions {
  page: number;
  perPage: number;
  categoryId?: number;
  status?: number;
  signal: AbortSignal;
}

interface MerchantOrderListProps {
  categoryId?: number;
  status: number;
  userId: any;
  showFilter: boolean;
}

interface UseOrderListReturn {
  orders: OrderItem[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | undefined;
  fetchNextPage: () => void;
  refetchWithFilters: (categoryIds: number, status: number) => void;
}

// Custom Hook
const useOrderList = (
  initialCategoryId: number | undefined,
  initialStatus: number | undefined,
  userId: any
): UseOrderListReturn => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(
    initialCategoryId
  );
  const [filteredStatus, setFilteredStatus] = useState<number | undefined>(
    initialStatus
  );

  const orderService = useMemo(
    () => new OrderService(new OrderRepository(new AxiosCustomClient())),
    []
  );

  const merchantId = useMemo(() => userId, [userId]);
  const t = useTranslations();

  const fetchOrders = useCallback(
    async ({
      page,
      perPage,
      categoryId,
      status,
      signal,
    }: FetchOrdersOptions) => {
      try {
        setIsLoading(true);
        setError(undefined);

        const filter: OrderFilterDto = {
          merchant_id: merchantId,
          page: page,
          per_page: perPage,
        };

        if (categoryId !== undefined) {
          filter.category_id = categoryId;
        }
        if (status !== undefined) {
          filter.status = status;
        }

        const response = await orderService.getMerchantOrderList({ ...filter });

        setOrders(previous =>
          page === 1
            ? response.order_items
            : [...previous, ...response.order_items]
        );
        setHasMore(response.order_items.length >= perPage);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(
            error instanceof Error
              ? error.message
              : t('merchantOrders.failedToFetchOrders')
          );
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [orderService, merchantId, t]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders({
      page,
      perPage: ORDERS_PER_PAGE,
      categoryId,
      status: filteredStatus,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [page, categoryId, filteredStatus, fetchOrders]);

  const fetchNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(previous => previous + 1);
    }
  }, [hasMore, isLoading]);

  const refetchWithFilters = useCallback(
    (newCategoryId: number, newStatus: number) => {
      setCategoryId(newCategoryId === -1 ? undefined : newCategoryId);
      setFilteredStatus(newStatus === -1 ? undefined : newStatus);
      setOrders([]);
      setPage(1);
      setHasMore(true);
    },
    []
  );

  return {
    orders,
    isLoading,
    hasMore,
    error,
    fetchNextPage,
    refetchWithFilters,
  };
};

// Filter Component
const OrderListFilter = ({
  onApplyFilter,
  defaultCategoryId,
  defaultStatus,
}: {
  onApplyFilter: (categoryId: number, status: number) => void;
  defaultCategoryId?: number;
  defaultStatus?: number;
}) => {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultCategoryId?.toString() || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    defaultStatus?.toString() || 'all'
  );

  const categories = [
    { id: 'all', name: t('merchantOrders.orderCategories.all') },
    { id: '1', name: t('merchantOrders.orderCategories.food') },
    { id: '2', name: t('merchantOrders.orderCategories.drinks') },
    { id: '3', name: t('merchantOrders.orderCategories.desserts') },
  ];

  const statuses = [
    { id: 'all', name: t('merchantOrders.orderStatus.all') },
    // { id: '0', name: 'Pending' },
    { id: '1', name: t('merchantOrders.orderStatus.pending') },
    { id: '6', name: t('merchantOrders.orderStatus.completed') },
    { id: '4', name: t('merchantOrders.orderStatus.cancelled') },
  ];

  const handleApply = useCallback(() => {
    const categoryId =
      selectedCategory === 'all' ? -1 : Number.parseInt(selectedCategory);
    const status =
      selectedStatus === 'all' ? -1 : Number.parseInt(selectedStatus);
    onApplyFilter(categoryId, status);
  }, [selectedCategory, selectedStatus, onApplyFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 items-center py-4 w-full"
    >
      {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
          <SelectValue placeholder={t('merchantOrders.selectCategory')} />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm focus:ring-0">
          <SelectValue placeholder={t('merchantOrders.selectStatus')} />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(status => (
            <SelectItem key={status.id} value={status.id}>
              {status.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleApply}
        className="bg-orange-500 hover:bg-orange-600 text-white transition-colors"
      >
        {t('merchantOrders.applyFilters')}
      </Button>
    </motion.div>
  );
};

// Main Component
function MerchantOrderList(props: MerchantOrderListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const { categoryId, status, userId, showFilter } = props;
  const t = useTranslations();

  const initialCategoryId = useMemo(() => categoryId, [categoryId]);
  const initialStatus = useMemo(() => status, [status]);

  const {
    orders,
    isLoading,
    hasMore,
    error,
    fetchNextPage,
    refetchWithFilters,
  } = useOrderList(initialCategoryId, initialStatus, userId);

  const handleApplyFilter = useCallback(
    (categoryId: number, status: number) => {
      const params = new URLSearchParams(searchParams?.toString() || '');

      if (categoryId === -1) {
        params.delete('categoryId');
      } else {
        params.set('categoryId', categoryId.toString());
      }

      if (status === -1) {
        params.delete('status');
      } else {
        params.set('status', status.toString());
      }

      router.replace(`?${params.toString()}`, { scroll: false });
      refetchWithFilters(categoryId, status);
    },
    [router, searchParams, refetchWithFilters]
  );

  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNextPage();
        }
      },
      { root: scrollableRef.current, threshold: OBSERVER_THRESHOLD }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoading, fetchNextPage]);

  return (
    <div
      ref={scrollableRef}
      className="h-[92dvh] w-full overflow-y-auto scrollbar-none relative pb-3 bg-gray-50"
    >
      <header className="sticky top-0 z-30 px-6 bg-white border-b border-gray-200 shadow-sm">
        {showFilter && (
          <OrderListFilter
            onApplyFilter={handleApplyFilter}
            defaultCategoryId={initialCategoryId}
            defaultStatus={initialStatus}
          />
        )}
      </header>

      <section className="pt-4 px-2 flex flex-col w-full gap-y-3">
        <h4 className="mb-4 px-2 text-xl font-semibold text-gray-800">
          {t('merchantOrders.orders')}
        </h4>

        <AnimatePresence mode="wait">
          {orders.length === 0 && !isLoading && !error && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center justify-center text-gray-500 py-8"
            >
              {t('merchantOrders.noOrdersAvailable')}
            </motion.span>
          )}

          {error && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center justify-center text-red-500 py-8"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-3">
          {orders.map((order, index) => (
            <div
              key={order.id || index}
              // initial={{}}
              // animate={{}}
              // transition={{}}
              className="w-full"
            >
              <OrderPreviewCard orderItem={order} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div ref={observerRef} className="flex w-full justify-center my-4">
            <ProductScrollLoader color="#FE8C00" size={8} />
          </div>
        )}
      </section>
    </div>
  );
}

export default MerchantOrderList;
