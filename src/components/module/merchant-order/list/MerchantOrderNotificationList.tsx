// import { useGetNotifyOrderList } from '@/lib/hooks/service/order/useNotifyOrderList';
// import { useSession } from '@/lib/hooks/session/useSession';
// import { useMemo } from 'react';

// const QUERY_CONFIG = {
//   PAGE: 1,
//   PER_PAGE: 10,
//   STALE_TIME: 5 * 60 * 1000, // 5 minutes
//   INITIAL_ANIMATION_DURATION: 3000, // 3 seconds
// };

// function MerchantOrderNotificationList() {
//   const { data: sessionData } = useSession();
//   const merchantId = sessionData?.user?.id;

//   // Memoize query object
//   const queryParams = useMemo(
//     () => ({
//       merchant_id: 1,
//       page: QUERY_CONFIG.PAGE,
//       per_page: QUERY_CONFIG.PER_PAGE,
//     }),
//     [merchantId]
//   );

//   const { data: orderList, isLoading } = useGetNotifyOrderList(queryParams, {
//     enabled: !!merchantId,
//     staleTime: QUERY_CONFIG.STALE_TIME,
//   });
//   return <div></div>;
// }
// export default MerchantOrderNotificationList;
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { tap } from 'lodash';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetNotifyOrderList } from '@/lib/hooks/service/order/useNotifyOrderList';
import { useSession } from '@/lib/hooks/session/useSession';
import { cn } from '@/lib/utils';
// Constants
const QUERY_CONFIG = {
  PAGE: 1,
  PER_PAGE: 10,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
};

// Animation Variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  tap: { scale: 0.9, transition: { duration: 0.2 } },
};

const MerchantOrderNotificationList = () => {
  const { data: sessionData } = useSession();
  const merchantId = sessionData?.user?.merchant_id;
  const router = useRouter();
  const t = useTranslations('merchant_order_notification');
  // Memoize query params
  const queryParams = useMemo(
    () => ({
      merchant_id: merchantId, // Fallback to 1 if undefined
      page: QUERY_CONFIG.PAGE,
      per_page: QUERY_CONFIG.PER_PAGE,
    }),
    [merchantId]
  );

  const {
    data: orderList,
    isLoading,
    error,
  } = useGetNotifyOrderList(queryParams, {
    enabled: !!merchantId,
    staleTime: QUERY_CONFIG.STALE_TIME,
    refetchOnWindowFocus: false, // Avoid unnecessary refetches
  });

  // Memoize order items to prevent unnecessary re-renders
  const orderItems = useMemo(() => orderList?.order_items ?? [], [orderList]);

  // Render skeleton placeholders
  const renderSkeletons = () =>
    Array.from({ length: QUERY_CONFIG.PER_PAGE }, (_, index) => (
      <Skeleton key={index} className="h-24 w-full rounded-lg mt-1" />
    ));

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <Bell className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-sm">{t('no_new_order_notifications')}</p>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-red-500">
      <Bell className="h-12 w-12 mb-4" />
      <p className="text-sm">Failed to load notifications. Please try again.</p>
    </div>
  );

  const onSeeMoreClick = useCallback(() => {
    router.push('/application/merchant-order-list');
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 flex-1 h-full">
      <Card className="shadow-md w-full rounded-none h-full flex-1 overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Bell className="h-5 w-5 text-gray-600" />
            {t('order_notifications')}
            {orderItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {orderItems.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeletons()
          ) : error ? (
            renderErrorState()
          ) : orderItems.length === 0 ? (
            renderEmptyState()
          ) : (
            <AnimatePresence mode="wait">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-3"
              >
                {orderItems.map((item, index) => (
                  <motion.li
                    key={item.order_no + index}
                    variants={itemVariants}
                    layout
                    whileTap="tap"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product_name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          Order #{item.order_no} •{' '}
                          {new Date(item.order_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Voucher: {item.voucher_no}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Qty: {item.quantity}
                      </Badge>
                    </div>
                  </motion.li>
                ))}
                <motion.li
                  className="flex w-full items-center justify-center"
                  variants={itemVariants}
                >
                  <button
                    onClick={onSeeMoreClick}
                    className="flex w-full items-center justify-center px-[1rem] py-[0.3rem] border-[1px] rounded-[4px] gap-x-1 shadow-sm mt-1"
                  >
                    {t('see_more_order')}
                  </button>
                </motion.li>
              </motion.ul>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

MerchantOrderNotificationList.displayName = 'MerchantOrderNotificationList';
export default MerchantOrderNotificationList;
