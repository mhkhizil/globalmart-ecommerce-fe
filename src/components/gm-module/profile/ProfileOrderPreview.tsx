'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import OrderDetailCard, {
  OrderDetail,
  OrderStatus,
} from '@/components/module/customer-order/OrderDetailCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Order, OrderItem } from '@/core/entity/Order';
import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
// Type definitions
interface IInputProps {
  sessionData:
    | {
        user?: {
          id: number;
          roles: number;
          merchant_id: number;
        };
      }
    | undefined;
}

// Animation variants
const notificationVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: { opacity: 0, y: -20 },
};

function ProfileOrderPreview({ sessionData }: IInputProps) {
  const [orderItem, setOrderItem] = useState<OrderItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [customerOrder, setCustomerOrder] = useState<Order | undefined>();
  const t = useTranslations();
  // Memoized OrderService instance
  const orderService = useMemo(
    () => new OrderService(new OrderRepository(new AxiosCustomClient())),
    []
  );

  const isMerchant = sessionData?.user?.roles === 2;
  const merchantId = sessionData?.user?.merchant_id;

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      if (!isMerchant || !merchantId) {
        // For demo purposes, create a mock order for customer users
        // This should be replaced with actual API call when backend is ready
        if (!customerOrder) {
          try {
            setIsLoading(true);
            setError(undefined);
            const response = await orderService.getCustomerOrderList({
              user_id: sessionData?.user?.id || 0,
              page: 1,
              per_page: 1,
            });
            //console.log(response);
            if (mounted) {
              setCustomerOrder(response.order[0] || undefined);
            }
          } catch {
            if (mounted) {
              setError('Failed to fetch order details');
            }
          } finally {
            if (mounted) {
              setIsLoading(false);
            }
          }
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(undefined);
        const response = await orderService.getMerchantOrderList({
          merchant_id: merchantId,
          page: 1,
          per_page: 1,
        });

        if (mounted) {
          setOrderItem(response.order_items[0] || undefined);
        }
      } catch {
        if (mounted) {
          setError('Failed to fetch order details');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();
    return () => {
      mounted = false;
    };
  }, [isMerchant, merchantId, orderService, customerOrder, sessionData]);

  if (!sessionData?.user) {
    return; // Or a login prompt
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('profile.myOrders')}
        </h3>
        {isMerchant ? (
          <Link
            href="/application/merchant-order-list"
            className="text-sm font-medium text-orange-500 hover:underline"
          >
            {t('profile.seeAll')}
          </Link>
        ) : (
          <Link
            href="/application/user-order-list"
            className="text-sm font-medium text-orange-500 hover:underline"
          >
            {t('profile.seeAll')}
          </Link>
        )}
      </div>

      <AnimatePresence>
        {isMerchant && (
          <motion.div
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-4 px-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"
                />
              </div>
            ) : error ? (
              <Badge variant="destructive" className="w-full py-2">
                {error}
              </Badge>
            ) : orderItem ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-orange-50 border border-orange-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">New Order</Badge>
                    <span className="text-sm font-medium">
                      {t('profile.order')} #{orderItem.order_id}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-500 border-orange-500 hover:bg-orange-50"
                    asChild
                  >
                    <Link
                      href={`/application/merchant-orderitem-detail/${orderItem.order_id}`}
                    >
                      {t('profile.viewDetails')}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <p className="text-sm text-gray-500">
                {t('profile.noRecentOrders')}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isMerchant && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"
              />
            </div>
          ) : error ? (
            <Badge variant="destructive" className="w-full py-2">
              {error}
            </Badge>
          ) : (
            <div className="px-6 pb-6">
              {customerOrder ? (
                <OrderDetailCard order={customerOrder} />
              ) : (
                <span>{'No order found'}</span>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default ProfileOrderPreview;
