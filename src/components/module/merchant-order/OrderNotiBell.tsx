// import { useGetNotifyOrderList } from '@/lib/hooks/service/order/useNotifyOrderList';
// import { useSession } from '@/lib/hooks/session/useSession';
// import { Bell } from 'lucide-react';
// import { memo } from 'react';

// const OrderNotiBell = memo(() => {
//   const { data: sessionData } = useSession();
//   const { data: orderList } = useGetNotifyOrderList(
//     {
//       merchant_id: sessionData?.user?.id,
//       page: 1,
//       per_page: 10,
//     },
//     {
//       enabled: !!sessionData?.user?.id,
//     }
//   );
//   return (
//     <div>
//       <Bell className="hover:animate-[wiggle_1s_ease-in-out_infinite]" />
//     </div>
//   );
// });
// export default OrderNotiBell;

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useGetNotifyOrderList } from '@/lib/hooks/service/order/useNotifyOrderList';
import { useSession } from '@/lib/hooks/session/useSession';
import { cn } from '@/lib/utils';

// Constants for configurability
const QUERY_CONFIG = {
  PAGE: 1,
  PER_PAGE: 10,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  INITIAL_ANIMATION_DURATION: 3000, // 3 seconds
};

interface OrderNotiBellProps {
  bellColor?: string;
}

const OrderNotiBell = ({ bellColor = 'white' }: OrderNotiBellProps) => {
  const t = useTranslations();
  const { data: sessionData } = useSession();
  const merchantId = sessionData?.user?.merchant_id;
  const router = useRouter();
  // Memoize query object
  const queryParams = useMemo(
    () => ({
      merchant_id: merchantId,
      page: QUERY_CONFIG.PAGE,
      per_page: QUERY_CONFIG.PER_PAGE,
    }),
    [merchantId]
  );

  const { data: orderList, isLoading } = useGetNotifyOrderList(queryParams, {
    enabled: !!merchantId,
    staleTime: QUERY_CONFIG.STALE_TIME,
  });

  const [isInitialPulse, setIsInitialPulse] = useState(true);
  const orderCount = orderList?.order_items.length ?? 0;
  //   const orderCount = 1;

  // Run initial pulse animation on mount
  useEffect(() => {
    const timeout = setTimeout(
      () => setIsInitialPulse(false),
      QUERY_CONFIG.INITIAL_ANIMATION_DURATION
    );
    return () => clearTimeout(timeout);
  }, []);

  const onBellClick = useCallback(() => {
    router.push('/application/merchant-order-notification');
  }, [router]);

  const bellClassName = cn(
    'h-6 w-6 text-gray-600 transition-transform duration-100',
    // (isInitialPulse || isLoading) && 'animate-pulse', // Pulse on load or fetch
    orderCount > 0 && !isLoading && 'text-yellow-500', // Highlight when orders exist
    'hover:scale-110' // Slight scale on hover
  );

  const badgeClassName = cn(
    'absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white',
    orderCount > 99 && 'w-6',
    orderCount > 0 &&
      //   !isInitialPulse &&
      !isLoading &&
      'animate-[bounce_1s_ease-in-out_infinite]'
  );

  return (
    <div className="relative inline-block" onClick={onBellClick}>
      <Bell
        className={bellClassName}
        style={{ stroke: bellColor }} // Using inline style for the custom color
        aria-label={`${t('merchant.notifications')}, ${orderCount} ${t('merchant.newOrders')}${isLoading ? ' (' + t('common.loading') + ')' : ''}`}
      />
      {orderCount > 0 && !isLoading && (
        <span className={badgeClassName}>
          {orderCount > 99 ? '99+' : orderCount}
        </span>
      )}
    </div>
  );
};

OrderNotiBell.displayName = 'OrderNotiBell';
export default OrderNotiBell;
