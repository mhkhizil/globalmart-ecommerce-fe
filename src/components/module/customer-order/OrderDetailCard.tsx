'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Order, OrderItem } from '@/core/entity/Order';

// Define order status types
export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  SHIPPED = 2,
  CANCELLED = 3,
  REJECTED = 4,
  COMPLETED = 5,
}

// Map status to display colors (labels are now handled by translations)
const orderStatusConfig: {
  [key in OrderStatus]: { color: string };
} = {
  [OrderStatus.PENDING]: {
    color: 'bg-yellow-500',
  },
  [OrderStatus.CONFIRMED]: {
    color: 'bg-orange-500',
  },
  [OrderStatus.SHIPPED]: {
    color: 'bg-green-500',
  },
  [OrderStatus.CANCELLED]: {
    color: 'bg-red-500',
  },
  [OrderStatus.REJECTED]: {
    color: 'bg-red-500',
  },
  [OrderStatus.COMPLETED]: {
    color: 'bg-blue-500',
  },
};

// Define order item type
export interface OrderItemDetail {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  total: string;
}

// Define order type
export interface OrderDetail {
  id: number;
  order_no: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItemDetail[];
  total_items: number;
  grand_total: string;
}

interface OrderDetailCardProps {
  order: Order;
}

const formatDate = (dateString: string, locale = 'en-US') => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Get status badge color
const getStatusColor = (status: number) => {
  const statusKey = (status - 1) as OrderStatus;
  return orderStatusConfig[statusKey]?.color || 'bg-gray-500';
};

function OrderDetailCard({ order }: OrderDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Safe translation function with fallback
  const safeT = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  };

  // Get the current locale for date formatting - provide fallback
  const locale = (() => {
    try {
      return safeT('driver.locale', 'en-US');
    } catch {
      return 'en-US';
    }
  })();

  // Get translated status labels
  const getStatusLabel = (status: number) => {
    const statusKey = (status - 1) as OrderStatus;
    switch (statusKey) {
      case OrderStatus.PENDING: {
        return safeT('order.status.pending', 'Pending');
      }
      case OrderStatus.CONFIRMED: {
        return safeT('order.status.confirmed', 'Confirmed');
      }
      case OrderStatus.SHIPPED: {
        return safeT('order.status.shipped', 'Shipped');
      }
      case OrderStatus.CANCELLED: {
        return safeT('order.status.cancelled', 'Cancelled');
      }
      case OrderStatus.REJECTED: {
        return safeT('order.status.rejected', 'Rejected');
      }
      case OrderStatus.COMPLETED: {
        return safeT('order.status.completed', 'Completed');
      }
      default: {
        return safeT('order.status.pending', 'Pending');
      }
    }
  };

  // Animation variants for the collapsible section
  const collapsibleVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut' as const,
      },
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        {/* Order header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {safeT('order.orderNumber', 'Order ID')}
              </span>
              <span className="text-sm font-medium">{order.order_no}</span>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDate(order.created_at, locale)}
            </span>
            <span className="text-sm font-medium">
              {safeT('order.total', 'Total')}:{' '}
              <span className="text-orange-500 font-bold">
                {order.grand_total}
              </span>
            </span>
          </div>

          <div className="h-px bg-gray-200" />

          {/* First item preview (always visible) */}
          {order.order_items?.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <Image
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  width={52}
                  height={54}
                  className="rounded-lg object-cover"
                /> */}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {order.order_items[0].name}
                  </p>
                  <p className="text-sm font-bold text-orange-500">
                    {order.order_items[0].price} ×{' '}
                    {order.order_items[0].quantity}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-600">
                {order.order_items.length} {safeT('common.items', 'items')}
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 hover:bg-gray-300 bg-gray-100"
          >
            <Link
              className="w-full"
              href={`/application/user-order-detail/${order.id}`}
            >
              {safeT('order.orderDetails', 'View Order Details')}
            </Link>
          </Button>

          {/* Toggle button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <>
                <span className="text-xs">
                  {safeT('order.tabs.items', 'Order Items')}
                </span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="text-xs">
                  {safeT('order.tabs.items', 'Order Items')}
                </span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Collapsible section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={collapsibleVariants}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-3">
                  <div className="h-px bg-gray-200" />

                  {/* Order items list */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      {safeT('order.orderItems', 'Order Items')}
                    </h4>

                    {order.order_items?.map((item, index: number) => (
                      <motion.div
                        key={item.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          {/* <Image
                            src={item.image}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          /> */}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.total}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Order summary */}
                  <div className="h-px bg-gray-200" />
                  <div className="pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {safeT('order.total', 'Total')}
                      </span>
                      <span className="text-sm font-bold text-orange-500">
                        {order.grand_total}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderDetailCard;
