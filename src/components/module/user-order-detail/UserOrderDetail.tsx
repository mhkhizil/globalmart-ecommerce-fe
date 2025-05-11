'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/core/entity/Order';
import { useCancelOrderByMerchant } from '@/lib/hooks/service/order/useCancelOrderByMerchant';
import { useGetCustomerOrderDetail } from '@/lib/hooks/service/order/useGetCustomerOrderDetailById';
// Define order status types (same as in OrderDetailCard)
enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  SHIPPED = 2,
  CANCELLED = 3,
  REJECTED = 4,
  COMPLETED = 5,
}

// Define delivery status types
enum DeliveryStatus {
  PREPARING = 1,
  DELIVERY_PREPARING = 2,
  SENDING = 3,
  ACCEPTED = 4,
}

// Define driver info type for type checking
interface DriverInfo {
  id: number;
  name: string;
  phone: string;
  // Optional fields that might be added by the UI
  image?: string;
}

// Helper function to calculate progress width based on delivery status
const getProgressWidth = (status: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.PREPARING: {
      return '10%';
    } // Show a small progress even at first stage
    case DeliveryStatus.DELIVERY_PREPARING: {
      return '40%';
    }
    case DeliveryStatus.SENDING: {
      return '70%';
    }
    case DeliveryStatus.ACCEPTED: {
      return '100%';
    }
    default: {
      return '0%';
    }
  }
};

// Map status to display text, colors and icons
const orderStatusConfig = (t: any) => ({
  [OrderStatus.PENDING]: {
    label: t('order.status.pending'),
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    description: t('order.status.pendingDesc'),
  },
  [OrderStatus.CONFIRMED]: {
    label: t('order.status.confirmed'),
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    icon: <CheckCircle className="h-5 w-5 text-orange-500" />,
    description: t('order.status.confirmedDesc'),
  },
  [OrderStatus.SHIPPED]: {
    label: t('order.status.shipped'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: <Truck className="h-5 w-5 text-green-500" />,
    description: t('order.status.shippedDesc'),
  },
  [OrderStatus.CANCELLED]: {
    label: t('order.status.cancelled'),
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    description: t('order.status.cancelledDesc'),
  },
  [OrderStatus.REJECTED]: {
    label: t('order.status.rejected'),
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    description: t('order.status.rejectedDesc'),
  },
  [OrderStatus.COMPLETED]: {
    label: t('order.status.completed'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
    description: t('order.status.completedDesc'),
  },
});

// Map delivery status to display text, colors and icons
const deliveryStatusConfig = (t: any) => ({
  [DeliveryStatus.PREPARING]: {
    label: t('delivery.status.preparing.full'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: <Package className="h-5 w-5 text-purple-500" />,
    description: t('delivery.status.preparing.desc'),
  },
  [DeliveryStatus.DELIVERY_PREPARING]: {
    label: t('delivery.status.deliveryPreparing.full'),
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    icon: <Truck className="h-5 w-5 text-indigo-500" />,
    description: t('delivery.status.deliveryPreparing.desc'),
  },
  [DeliveryStatus.SENDING]: {
    label: t('delivery.status.onTheWay.full'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: <Truck className="h-5 w-5 text-blue-500" />,
    description: t('delivery.status.onTheWay.desc'),
  },
  [DeliveryStatus.ACCEPTED]: {
    label: t('delivery.status.delivered.full'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    description: t('delivery.status.delivered.desc'),
  },
});

interface IUserOrderDetailProps {
  id: string;
}

// Format date to readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format time to readable format
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

function UserOrderDetail(props: IUserOrderDetailProps) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetCustomerOrderDetail(
    props.id
  );
  const [activeSection, setActiveSection] = useState<'items' | 'timeline'>(
    'items'
  );
  // New state for tracking expanded driver cards
  const [expandedDriverGroups, setExpandedDriverGroups] = useState<Set<string>>(
    new Set()
  );
  // New state for cancel dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  // New state for cancel success
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const {
    mutate: cancelOrderByMerchant,
    isPending: isCancellingOrderByMerchant,
  } = useCancelOrderByMerchant({
    onSuccess: () => {
      setCancelSuccess(true);
      toast.success(t('order.cancelSuccess'));
      // Refetch order details after successful cancellation
      setTimeout(() => {
        refetch();
      }, 1000);
    },
    onError: error => {
      toast.error(error?.message || t('order.cancelError'));
    },
  });
  const t = useTranslations();

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
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // New animation variants for the cancel button
  const cancelButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
    disabled: { opacity: 0.7 },
  };

  // New animation for success message
  const successMessageVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 },
        y: { type: 'spring', stiffness: 300, damping: 30 },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        height: { duration: 0.3, delay: 0.1 },
        opacity: { duration: 0.2 },
        y: { duration: 0.2 },
      },
    },
  };

  // Check if all order items are in pending status (cancellable)
  const isCancellable = (orderData: typeof data): boolean => {
    if (!orderData) return false;

    // Order is cancellable only if status is PENDING (0)
    return orderData.status === OrderStatus.PENDING + 1;
  };

  // Handle cancel order
  const handleCancelOrder = () => {
    setShowCancelDialog(true);
  };

  // Confirm cancel order
  const confirmCancelOrder = () => {
    if (!data) return;
    cancelOrderByMerchant(data.id.toString());
    setShowCancelDialog(false);
  };

  // Reset success state after animation completes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (cancelSuccess) {
      timeoutId = setTimeout(() => {
        setCancelSuccess(false);
      }, 5000); // Hide success message after 5 seconds
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [cancelSuccess]);

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Handle toggling driver group expanded state
  const toggleDriverGroup = (groupId: string) => {
    setExpandedDriverGroups(previous => {
      const newSet = new Set(previous);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="h-[92dvh] w-full overflow-y-auto scrollbar-none p-4 space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32 ml-2" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[92dvh] w-full overflow-y-auto scrollbar-none p-4">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t('errors.loadingOrder')}
          </h3>
          <p className="text-gray-500 mb-4">
            {error?.message || t('errors.orderDetailsLoadFailed')}
          </p>
          <Button onClick={handleBack}>{t('common.goBack')}</Button>
        </div>
      </div>
    );
  }
  //console.log('data', data);
  // Determine order status
  const orderStatus = (data.status - 1) as OrderStatus;
  const statusInfo = orderStatusConfig(t)[orderStatus];

  // Updated type to include driver grouping
  type OrderItemsByDeliveryStatus = {
    [key in DeliveryStatus]?: {
      [driverId: string]: {
        items: typeof data.order_items;
        driver?: DriverInfo;
      };
    };
  };

  // Group items by delivery status AND driver
  const orderItemsByDeliveryStatus =
    data.order_items.reduce<OrderItemsByDeliveryStatus>((accumulator, item) => {
      const deliveryStatus = item.delivery_status as DeliveryStatus;

      if (
        !deliveryStatus ||
        !Object.values(DeliveryStatus).includes(deliveryStatus)
      ) {
        return accumulator;
      }

      // Initialize the delivery status group if needed
      if (!accumulator[deliveryStatus]) {
        accumulator[deliveryStatus] = {};
      }

      // Determine driver ID key - use 'no-driver' if no driver assigned
      const driverId = item.driver?.id
        ? `driver-${item.driver.id}`
        : 'no-driver';

      // Initialize the driver group if needed
      if (!accumulator[deliveryStatus]![driverId]) {
        accumulator[deliveryStatus]![driverId] = {
          items: [],
          driver: item.driver
            ? {
                id: item.driver.id,
                name: item.driver.name,
                phone: item.driver.phone,
              }
            : undefined,
        };
      }

      // Add item to the appropriate group
      accumulator[deliveryStatus]![driverId].items.push(item);
      return accumulator;
    }, {});

  // Sort delivery statuses from highest to lowest for display (show most advanced status first)
  const sortedDeliveryStatuses = Object.keys(orderItemsByDeliveryStatus)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="h-[92dvh] w-full overflow-y-auto scrollbar-none">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">{t('order.orderDetails')}</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Status Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <Card
            className={`overflow-hidden border-l-4 ${statusInfo.color.replace('text', 'border')}`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
                    {statusInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {statusInfo.description}
                        </p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                        #{data.order_no}
                      </Badge>
                    </div>

                    {/* Cancel success message */}
                    <AnimatePresence>
                      {cancelSuccess && (
                        <motion.div
                          variants={successMessageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-3 pt-3 border-t border-gray-100"
                        >
                          <motion.div
                            className="bg-green-50 border border-green-100 rounded-md p-3 flex items-center gap-2"
                            initial={{ x: -5, opacity: 0.8 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <div className="bg-green-100 p-1.5 rounded-full">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                {t('order.cancelSuccess')}
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                {t('order.cancelSuccessDetails')}
                              </p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {/* Add cancel button if order is cancellable */}
                {isCancellable(data) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="mt-3 pt-3 border-t border-gray-100 w-full"
                  >
                    <motion.div
                      variants={cancelButtonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      animate={
                        isCancellingOrderByMerchant ? 'disabled' : 'initial'
                      }
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2 relative overflow-hidden group"
                        onClick={handleCancelOrder}
                        disabled={isCancellingOrderByMerchant}
                      >
                        {isCancellingOrderByMerchant ? (
                          <>
                            <span className="absolute inset-0 bg-red-800 opacity-10"></span>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{t('order.cancelling')}</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4 transition-transform group-hover:rotate-12" />
                            <span>{t('order.cancelOrder')}</span>
                            <span className="absolute right-0 h-full w-8 bg-gradient-to-l from-red-600 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Status Cards - UPDATED FOR MULTIPLE DRIVERS */}
        {sortedDeliveryStatuses.length > 0 &&
        orderStatus !== OrderStatus.CANCELLED &&
        orderStatus !== OrderStatus.REJECTED ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <Truck className="h-4 w-4 mr-2 text-gray-500" /> */}
                <div>
                  <h3 className="text-md font-medium text-gray-800 flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                    {t('delivery.deliveryStatus')}
                  </h3>
                  {/* <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 border-gray-200"
                  >
                    {Object.keys(orderItemsByDeliveryStatus).length}{' '}
                    {Object.keys(orderItemsByDeliveryStatus).length === 1
                      ? t('common.status')
                      : t('common.statuses')}
                  </Badge> */}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sortedDeliveryStatuses.map((statusKey, groupIndex) => {
                const deliveryStatus = statusKey as DeliveryStatus;
                const deliveryStatusInfo =
                  deliveryStatusConfig(t)[deliveryStatus];
                const driverGroups = orderItemsByDeliveryStatus[deliveryStatus];

                // Skip if no items or invalid status
                if (!driverGroups || !deliveryStatusInfo) return;

                // Count total items in this delivery status across all drivers
                const totalItemsInStatus = Object.values(driverGroups).reduce(
                  (sum, group) => sum + group.items.length,
                  0
                );

                return (
                  <motion.div
                    key={`delivery-status-${statusKey}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: groupIndex * 0.1,
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                    }}
                  >
                    <Card
                      className={`overflow-hidden border-l-4 ${deliveryStatusInfo.color.replace('text', 'border')}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-2 rounded-full ${deliveryStatusInfo.bgColor}`}
                              >
                                {deliveryStatusInfo.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3
                                      className={`font-semibold ${deliveryStatusInfo.color}`}
                                    >
                                      {deliveryStatusInfo.label}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {deliveryStatusInfo.description}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`${deliveryStatusInfo.color.replace('text', 'border')} ${deliveryStatusInfo.color} text-nowrap bg-opacity-10`}
                                  >
                                    {totalItemsInStatus}{' '}
                                    {totalItemsInStatus === 1
                                      ? t('common.item')
                                      : t('common.items')}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Progress Indicator */}
                            <div className="mt-4 mb-3">
                              <div className="relative flex items-center justify-between mb-2">
                                {/* Stage 1: Preparing */}
                                <div className="flex flex-col items-center z-10">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center 
                                    ${
                                      deliveryStatus >= DeliveryStatus.PREPARING
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    <span className="text-xs">1</span>
                                  </div>
                                  <span
                                    className={`text-xs mt-1 
                                    ${deliveryStatus >= DeliveryStatus.PREPARING ? 'text-purple-600' : 'text-gray-500'}`}
                                  >
                                    {t('delivery.status.preparing.short')}
                                  </span>
                                </div>

                                {/* Stage 2: Delivery Prep */}
                                <div className="flex flex-col items-center z-10">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center 
                                    ${
                                      deliveryStatus >=
                                      DeliveryStatus.DELIVERY_PREPARING
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    <span className="text-xs">2</span>
                                  </div>
                                  <span
                                    className={`text-xs mt-1 
                                    ${deliveryStatus >= DeliveryStatus.DELIVERY_PREPARING ? 'text-indigo-600' : 'text-gray-500'}`}
                                  >
                                    {t(
                                      'delivery.status.deliveryPreparing.short'
                                    )}
                                  </span>
                                </div>

                                {/* Stage 3: Sending */}
                                <div className="flex flex-col items-center z-10">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center 
                                    ${
                                      deliveryStatus >= DeliveryStatus.SENDING
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    <span className="text-xs">3</span>
                                  </div>
                                  <span
                                    className={`text-xs mt-1 
                                    ${deliveryStatus >= DeliveryStatus.SENDING ? 'text-blue-600' : 'text-gray-500'}`}
                                  >
                                    {t('delivery.status.onTheWay.short')}
                                  </span>
                                </div>

                                {/* Stage 4: Delivered */}
                                <div className="flex flex-col items-center z-10">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center 
                                    ${
                                      deliveryStatus >= DeliveryStatus.ACCEPTED
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    <span className="text-xs">4</span>
                                  </div>
                                  <span
                                    className={`text-xs mt-1 
                                    ${deliveryStatus >= DeliveryStatus.ACCEPTED ? 'text-green-600' : 'text-gray-500'}`}
                                  >
                                    {t('delivery.status.delivered.short')}
                                  </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
                                <motion.div
                                  className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-green-500 -z-0"
                                  initial={{ width: '0%' }}
                                  animate={{
                                    width: getProgressWidth(deliveryStatus),
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    ease: 'easeOut',
                                  }}
                                />
                              </div>
                            </div>

                            {/* Driver Groups - NEW SECTION FOR MULTIPLE DRIVERS */}
                            <div className="mt-4 space-y-4">
                              {/* For each driver group */}
                              {Object.entries(driverGroups).map(
                                ([driverId, driverGroup], driverIndex) => {
                                  const { items, driver } = driverGroup;
                                  const hasDriverAssigned = !!driver;
                                  const groupKey = `${deliveryStatus}-${driverId}`;
                                  const isExpanded =
                                    expandedDriverGroups.has(groupKey);

                                  return (
                                    <motion.div
                                      key={`${groupKey}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        delay: driverIndex * 0.05,
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 24,
                                      }}
                                      className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
                                    >
                                      {/* Driver header - clickable to expand/collapse */}
                                      <div
                                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 ${isExpanded ? 'border-b border-gray-100' : ''}`}
                                        onClick={() =>
                                          toggleDriverGroup(groupKey)
                                        }
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`p-2 rounded-full ${hasDriverAssigned ? 'bg-indigo-100' : 'bg-gray-100'}`}
                                          >
                                            <UserRound
                                              className={`h-4 w-4 ${hasDriverAssigned ? 'text-indigo-600' : 'text-gray-400'}`}
                                            />
                                          </div>
                                          <div>
                                            {hasDriverAssigned ? (
                                              <p className="text-sm font-medium">
                                                {driver?.name ||
                                                  t('delivery.driverAssigned')}
                                              </p>
                                            ) : (
                                              <p className="text-sm font-medium">
                                                {t('delivery.awaitingDriver')}
                                              </p>
                                            )}
                                            <div className="flex items-center gap-2  text-xs text-gray-500">
                                              <span>
                                                {items.length}{' '}
                                                {items.length === 1
                                                  ? t('common.item')
                                                  : t('common.items')}
                                              </span>
                                              {deliveryStatus >=
                                                DeliveryStatus.DELIVERY_PREPARING &&
                                                hasDriverAssigned && (
                                                  <>
                                                    <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                                                    <span
                                                      className={`${deliveryStatus === DeliveryStatus.SENDING ? 'text-blue-600' : deliveryStatus === DeliveryStatus.ACCEPTED ? 'text-green-600' : 'text-indigo-600'}`}
                                                    >
                                                      {deliveryStatus ===
                                                      DeliveryStatus.SENDING
                                                        ? t(
                                                            'delivery.status.onTheWay.short'
                                                          )
                                                        : deliveryStatus ===
                                                            DeliveryStatus.ACCEPTED
                                                          ? t(
                                                              'delivery.status.delivered.short'
                                                            )
                                                          : t(
                                                              'delivery.status.deliveryPreparing.short'
                                                            )}
                                                    </span>
                                                  </>
                                                )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          {hasDriverAssigned &&
                                            driver?.phone && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-2 h-auto"
                                                onClick={event => {
                                                  event.stopPropagation();
                                                  window.open(
                                                    `tel:${driver.phone}`,
                                                    '_self'
                                                  );
                                                }}
                                              >
                                                <Phone className="h-4 w-4" />
                                              </Button>
                                            )}
                                          {hasDriverAssigned &&
                                            !driver?.phone && (
                                              <div className="flex items-center gap-1 text-gray-400 text-xs px-2">
                                                <Phone className="h-3 w-3" />
                                                <span>
                                                  {t('common.noContactInfo')}
                                                </span>
                                              </div>
                                            )}
                                          <motion.div
                                            animate={{
                                              rotate: isExpanded ? 180 : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="text-gray-400 rounded-full p-1"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="m6 9 6 6 6-6" />
                                            </svg>
                                          </motion.div>
                                        </div>
                                      </div>

                                      {/* Expandable content - items and driver details */}
                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{
                                              height: 0,
                                              opacity: 0,
                                            }}
                                            animate={{
                                              height: 'auto',
                                              opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-3 pb-3"
                                          >
                                            {/* Driver information for delivery statuses that need it */}
                                            {deliveryStatus >=
                                              DeliveryStatus.DELIVERY_PREPARING && (
                                              <div className="mb-3 pt-3">
                                                {hasDriverAssigned ? (
                                                  <div className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm space-y-3">
                                                    <div className="flex justify-between items-center">
                                                      <h4 className="text-sm font-medium text-gray-800 flex items-center">
                                                        <Truck className="h-4 w-4 mr-1 text-indigo-500" />
                                                        {t(
                                                          'delivery.deliveryInformation'
                                                        )}
                                                      </h4>
                                                      <Badge
                                                        variant="outline"
                                                        className={`${
                                                          deliveryStatus ===
                                                          DeliveryStatus.SENDING
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : deliveryStatus ===
                                                                DeliveryStatus.ACCEPTED
                                                              ? 'bg-green-50 text-green-700 border-green-200'
                                                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                        }`}
                                                      >
                                                        {deliveryStatus ===
                                                        DeliveryStatus.SENDING
                                                          ? t(
                                                              'delivery.liveTracking'
                                                            )
                                                          : deliveryStatus ===
                                                              DeliveryStatus.ACCEPTED
                                                            ? t(
                                                                'delivery.status.delivered.short'
                                                              )
                                                            : t(
                                                                'delivery.status.deliveryPreparing.short'
                                                              )}
                                                      </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                      <div className="bg-indigo-100 rounded-full p-2">
                                                        <UserRound className="h-4 w-4 text-indigo-600" />
                                                      </div>
                                                      <div>
                                                        <p className="text-xs text-gray-500">
                                                          {t('delivery.driver')}
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                          {driver?.name ||
                                                            t(
                                                              'delivery.unknownDriver'
                                                            )}
                                                        </p>
                                                      </div>
                                                    </div>

                                                    {hasDriverAssigned &&
                                                      driver?.phone && (
                                                        <div className="flex items-center gap-3 mt-3">
                                                          <div className="flex items-center gap-1">
                                                            <Phone className="h-4 w-4" />
                                                            <div className="text-sm">
                                                              {driver?.phone}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}

                                                    {hasDriverAssigned &&
                                                      !driver?.phone && (
                                                        <div className="flex items-center gap-3 mt-3">
                                                          <div className="flex items-center gap-1 text-gray-500">
                                                            <Phone className="h-4 w-4" />
                                                            <div className="text-sm italic">
                                                              {t(
                                                                'common.noContactInfo'
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}

                                                    {deliveryStatus ===
                                                      DeliveryStatus.SENDING && (
                                                      <motion.div
                                                        initial={{
                                                          opacity: 0,
                                                        }}
                                                        animate={{
                                                          opacity: 1,
                                                        }}
                                                        transition={{
                                                          delay: 0.3,
                                                        }}
                                                        className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100"
                                                      >
                                                        <div className="text-xs text-gray-500">
                                                          <span className="mr-1">
                                                            Estimated delivery:
                                                          </span>
                                                          <span className="font-medium text-gray-900">
                                                            15-25 min
                                                          </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                          <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                                                          <span className="text-xs text-green-600 font-medium">
                                                            In transit
                                                          </span>
                                                        </div>
                                                      </motion.div>
                                                    )}

                                                    {deliveryStatus ===
                                                      DeliveryStatus.ACCEPTED && (
                                                      <motion.div
                                                        initial={{
                                                          opacity: 0,
                                                        }}
                                                        animate={{
                                                          opacity: 1,
                                                        }}
                                                        className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100"
                                                      >
                                                        <div className="flex items-center">
                                                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                          <span className="text-sm text-green-600 font-medium">
                                                            Delivered
                                                            successfully
                                                          </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                          Thank you!
                                                        </span>
                                                      </motion.div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-md">
                                                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                                                    <p className="text-sm text-yellow-700">
                                                      Driver will be assigned
                                                      soon. Please check back
                                                      later.
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {/* Items list */}
                                            <div className="space-y-2">
                                              <p className="text-xs font-medium text-gray-500">
                                                Items in this group:
                                              </p>
                                              <div className="grid grid-cols-1 gap-2">
                                                {items.map((item, index) => (
                                                  <motion.div
                                                    key={`driver-item-${item.id}`}
                                                    initial={{
                                                      opacity: 0,
                                                      y: 10,
                                                    }}
                                                    animate={{
                                                      opacity: 1,
                                                      y: 0,
                                                    }}
                                                    transition={{
                                                      delay: index * 0.05,
                                                      type: 'spring',
                                                      stiffness: 300,
                                                      damping: 24,
                                                    }}
                                                    className="flex items-center p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                  >
                                                    <div className="bg-white rounded-md h-10 w-10 flex items-center justify-center text-gray-400 mr-3 border border-gray-100 shadow-sm">
                                                      <Package className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                      <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                      </p>
                                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>
                                                          Qty: {item.quantity}
                                                        </span>
                                                        <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                                                        <span>
                                                          {item.price}
                                                        </span>
                                                        <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                                                        <span>
                                                          {t(
                                                            'order.summary.from'
                                                          )}
                                                          : {item.merchant_name}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div className="text-right ml-2">
                                                      <p
                                                        className={`text-sm font-semibold ${deliveryStatusInfo.color}`}
                                                      >
                                                        {item.total}
                                                      </p>
                                                      {item.discount_amt >
                                                        0 && (
                                                        <p className="text-xs text-green-600">
                                                          {t(
                                                            'order.summary.discount'
                                                          )}
                                                          : {item.discount_amt}
                                                        </p>
                                                      )}
                                                    </div>
                                                  </motion.div>
                                                ))}
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : orderStatus === OrderStatus.CANCELLED ||
          orderStatus === OrderStatus.REJECTED ? (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Ban className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                {t('delivery.noDeliveryInfoAvailable')}
              </p>
              <p className="text-sm text-gray-500">
                {orderStatus === OrderStatus.CANCELLED
                  ? t('delivery.orderCancelledDeliveryInfo')
                  : t('delivery.orderRejectedDeliveryInfo')}
              </p>
            </div>
          </div>
        ) : undefined}

        {/* Order Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="grid grid-cols-2 gap-3"
        >
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    {t('order.info.date')}
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(data.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    {t('order.info.time')}
                  </p>
                  <p className="text-sm font-medium">
                    {formatTime(data.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    {t('order.info.items')}
                  </p>
                  <p className="text-sm font-medium">
                    {data.order_items.length}{' '}
                    {data.order_items.length === 1
                      ? t('common.item')
                      : t('common.items')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    {t('order.info.voucher')}
                  </p>
                  <p className="text-sm font-medium">
                    {data.voucher_no || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{t('order.summary.title')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t('order.summary.subtotal')}
                  </span>
                  <span>{data.sub_total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t('order.summary.discount')}
                  </span>
                  <span className="text-green-600">-{data.discount_total}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{t('order.summary.total')}</span>
                  <span className="text-orange-500">{data.grand_total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeSection === 'items'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveSection('items')}
          >
            {t('order.tabs.items')}
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeSection === 'timeline'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveSection('timeline')}
          >
            {t('order.tabs.timeline')}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'items' ? (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {data.order_items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          custom={index}
                          variants={itemVariants}
                          className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-md h-12 w-12 flex items-center justify-center text-gray-400">
                              <Package className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{item.price}</span>
                                <span>×</span>
                                <span>{item.quantity}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {t('order.summary.from')}: {item.merchant_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-500">
                              {item.total}
                            </p>
                            {item.discount_amt > 0 && (
                              <p className="text-xs text-green-600">
                                {t('order.summary.discount')}:{' '}
                                {item.discount_amt}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Order Placed */}
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" />
                      </div>
                      <div className="pb-6">
                        <p className="font-medium">
                          {t('order.timeline.orderPlaced')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(data.created_at)} at{' '}
                          {formatTime(data.created_at)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('order.status.pendingDesc')}
                        </p>
                      </div>
                    </div>

                    {/* Order Confirmed (if applicable) */}
                    <div className="flex gap-3">
                      <div className="relative">
                        <div
                          className={`h-8 w-8 rounded-full ${data.status > OrderStatus.PENDING + 1 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}
                        >
                          {data.status > OrderStatus.PENDING + 1 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" />
                      </div>
                      <div className="pb-6">
                        <p
                          className={`font-medium ${data.status > OrderStatus.PENDING + 1 ? 'text-gray-900' : 'text-gray-500'}`}
                        >
                          {t('order.timeline.orderConfirmed')}
                        </p>
                        {data.confirmation_time ? (
                          <p className="text-sm text-gray-500">
                            {formatDate(data.confirmation_time)} at{' '}
                            {formatTime(data.confirmation_time)}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {t('order.timeline.pendingStatus')}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {t('order.status.confirmedDesc')}
                        </p>
                      </div>
                    </div>

                    {/* Order Shipped (if applicable) */}
                    <div className="flex gap-3">
                      <div className="relative">
                        <div
                          className={`h-8 w-8 rounded-full ${data.status > OrderStatus.CONFIRMED + 1 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}
                        >
                          {data.status > OrderStatus.CONFIRMED + 1 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        {data.status !== OrderStatus.COMPLETED + 1 && (
                          <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p
                          className={`font-medium ${data.status > OrderStatus.CONFIRMED + 1 ? 'text-gray-900' : 'text-gray-500'}`}
                        >
                          {t('order.timeline.orderShipped')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {data.status > OrderStatus.CONFIRMED + 1
                            ? t('order.timeline.onTheWayStatus')
                            : t('order.timeline.pendingStatus')}
                        </p>
                        {data.order_items[0]?.driver_name && (
                          <p className="text-sm text-gray-600 mt-1">
                            {t('order.timeline.driver')}:{' '}
                            {data.order_items[0].driver_name} (
                            {data.order_items[0].driver_contact_number ||
                              t('order.timeline.noContact')}
                            )
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Completed (if applicable) */}
                    {data.status === OrderStatus.COMPLETED + 1 && (
                      <div className="flex gap-3">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">
                            {t('order.timeline.orderCompleted')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('order.status.completedDesc')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Cancelled/Rejected (if applicable) */}
                    {(data.status === OrderStatus.CANCELLED + 1 ||
                      data.status === OrderStatus.REJECTED + 1) && (
                      <div className="flex gap-3">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">
                            {data.status === OrderStatus.CANCELLED + 1
                              ? t('order.timeline.orderCancelled')
                              : t('order.timeline.orderRejected')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {data.status === OrderStatus.CANCELLED + 1
                              ? t('order.status.cancelledDesc')
                              : t('order.status.rejectedDesc')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="sm:max-w-md w-[90%] p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="text-center mb-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
              <Ban className="h-7 w-7 text-red-600" />
            </div>
          </div>

          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-center text-xl font-semibold">
              {t('order.cancelConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t('order.cancelConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-5 bg-amber-50 border border-amber-100 rounded-md p-4">
            <ul className="text-sm text-amber-800 space-y-3">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{t('order.cancelWarning1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{t('order.cancelWarning2')}</span>
              </li>
            </ul>
          </div>

          <AlertDialogFooter className="sm:space-x-3 gap-3">
            <AlertDialogCancel className="border-gray-200 mt-0">
              {t('common.nevermind')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelOrder}
              className="bg-red-600 hover:bg-red-700 gap-2 transition-colors"
              disabled={isCancellingOrderByMerchant}
            >
              {isCancellingOrderByMerchant ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('order.processing')}</span>
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  <span>{t('order.confirmCancel')}</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserOrderDetail;
