'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCancelOrderByDriver } from '@/lib/hooks/service/order/useCancelOrderByDriver';
import { useGetDriverOrderDetail } from '@/lib/hooks/service/order/useGetDriverOrderDetail';
import { useUpdateDeliveryStatus } from '@/lib/hooks/service/order/useUpdateDeliveryStatus';
import { useSession } from '@/lib/hooks/session/useSession';

// Define delivery status types with updated mapping
enum DeliveryStatus {
  PREPARING = 1, // Order is preparing
  READY = 2, // Delivery is preparing
  DELIVERING = 3, // Delivery is sending
  COMPLETED = 4, // Customer accepted order
}

// Animation variants for the Back button
const backButtonVariants = {
  hover: { x: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

// Define new animation variants for cancel button
const cancelButtonVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

// Map delivery status to display text and colors with updated descriptions
const deliveryStatusConfig = {
  [DeliveryStatus.PREPARING]: {
    label: 'Order Preparing',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    icon: <Package className="h-5 w-5 text-yellow-500" />,
    buttonLabel: 'Mark As Ready',
    nextStatus: DeliveryStatus.READY,
  },
  [DeliveryStatus.READY]: {
    label: 'Ready For Delivery',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    icon: <Package className="h-5 w-5 text-indigo-500" />,
    buttonLabel: 'Start Delivery',
    nextStatus: DeliveryStatus.DELIVERING,
  },
  [DeliveryStatus.DELIVERING]: {
    label: 'Out For Delivery',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: <Truck className="h-5 w-5 text-blue-500" />,
    buttonLabel: 'Mark As Delivered',
    nextStatus: DeliveryStatus.COMPLETED,
  },
  [DeliveryStatus.COMPLETED]: {
    label: 'Delivered',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    buttonLabel: 'Order Completed',
    nextStatus: undefined,
  },
};

// Format date for display
const formatDate = (dateString: string, locale?: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

interface IDriverOrderDetailProps {
  id: string;
}

function DriverOrderDetail(props: IDriverOrderDetailProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [copyingPhone, setCopyingPhone] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellationLoading, setCancellationLoading] = useState(false);

  // Fetch order details
  const {
    data: orderDetail,
    isLoading,
    refetch,
  } = useGetDriverOrderDetail(
    {
      order_id: Number.parseInt(id),
      driver_id: session?.user?.driver_id,
    },
    {
      enabled: !!id && !!session?.user?.driver_id,
      refetchOnWindowFocus: false,
    }
  );

  const queryClient = useQueryClient();

  // Update delivery status mutation
  const { mutate: updateDeliveryStatus, isPending: isUpdating } =
    useUpdateDeliveryStatus({
      onSuccess: async () => {
        toast.success(t('driver.statusUpdateSuccess'));
        setIsDialogOpen(false);
        setStatusUpdateLoading(true);
        await queryClient.invalidateQueries({
          queryKey: ['get-order-list-count'],
        });
        // Trigger a refetch to get the updated data
        setTimeout(() => {
          refetch().then(() => {
            setStatusUpdateLoading(false);
          });
        }, 500);
      },
      onError: error => {
        toast.error(error.message || t('driver.statusUpdateFailed'));
        setIsDialogOpen(false);
        setStatusUpdateLoading(false);
      },
    });

  const { mutate: cancelOrder, isPending: isCancelling } =
    useCancelOrderByDriver({
      onSuccess: async () => {
        setCancellationLoading(true);
        toast.success(t('driver.orderCancelled'));
        setCancelReason('');
        setIsCancelDialogOpen(false);
        await queryClient.invalidateQueries({
          queryKey: ['get-order-list-count'],
        });
        // Short delay for a better UX before redirecting
        setTimeout(() => {
          router.push('/application/driver-order-list');
        }, 1000);
      },
      onError: error => {
        toast.error(error.message || t('driver.orderCancellationFailed'));
        setIsCancelDialogOpen(false);
        setCancellationLoading(false);
      },
    });

  // Handle cancel order
  const handleCancelOrder = () => {
    if (!orderDetail || !id) return;

    setCancellationLoading(true);
    cancelOrder({
      order_id: Number.parseInt(id), // Using the id string directly
      merchant_id: orderDetail.merchant_id, // Convert to string
    });
  };

  // Handle status update
  const handleStatusUpdate = (newStatus: number) => {
    if (!orderDetail || !id) return;

    setStatusUpdateLoading(true);
    updateDeliveryStatus({
      order_id: Number.parseInt(id),
      delivery_status: newStatus,
      merchant_id: orderDetail.merchant_id,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const refreshAnimation = {
    rotate: [0, 360],
    transition: { duration: 1, repeat: 1, ease: 'easeInOut' },
  };

  // Helper function to get translated status label
  const getTranslatedStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.PREPARING: {
        return t('driver.orderPreparing');
      }
      case DeliveryStatus.READY: {
        return t('driver.readyForDelivery');
      }
      case DeliveryStatus.DELIVERING: {
        return t('driver.outForDelivery');
      }
      case DeliveryStatus.COMPLETED: {
        return t('driver.delivered');
      }
      default: {
        return t('driver.unknown');
      }
    }
  };

  // Helper function to get translated button label
  const getTranslatedButtonLabel = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.PREPARING: {
        return t('driver.markAsReady');
      }
      case DeliveryStatus.READY: {
        return t('driver.startDelivery');
      }
      case DeliveryStatus.DELIVERING: {
        return t('driver.markAsDelivered');
      }
      case DeliveryStatus.COMPLETED: {
        return t('driver.orderCompleted');
      }
      default: {
        return '';
      }
    }
  };

  // Helper to get current status config with translations
  const getStatusConfig = () => {
    if (!orderDetail) return;
    const statusConfig =
      deliveryStatusConfig[orderDetail.delivery_status as DeliveryStatus] ||
      undefined;

    if (statusConfig) {
      return {
        ...statusConfig,
        label: getTranslatedStatusLabel(
          orderDetail.delivery_status as DeliveryStatus
        ),
        buttonLabel: getTranslatedButtonLabel(
          orderDetail.delivery_status as DeliveryStatus
        ),
      };
    }

    return;
  };

  // Helper to check if status can be updated
  const canUpdateStatus = () => {
    if (!orderDetail) return false;
    const statusConfig = getStatusConfig();
    return statusConfig && statusConfig.nextStatus !== undefined;
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshTrigger(previous => previous + 1);
    setRefreshLoading(true);

    refetch().then(() => {
      setTimeout(() => setRefreshLoading(false), 500);
    });
  };

  // Handle opening the cancel dialog
  const handleOpenCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    if (!text) return;

    try {
      setCopyingPhone(true);
      await navigator.clipboard.writeText(text);
      toast.success(t('driver.phoneCopied'));
    } catch (error) {
      toast.error(t('driver.copyFailed'));
      console.error('Failed to copy text:', error);
    } finally {
      setCopyingPhone(false);
      // Add animation effect
      setTimeout(() => setCopyingPhone(false), 1000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`order-${refreshTrigger}`}
        className="w-full overflow-y-auto scrollbar-none pb-20 max-w-3xl mx-auto relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Status Update Loading Overlay */}
        {statusUpdateLoading && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-sm w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t('driver.updatingStatus')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('driver.updatingStatusDescription')}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Cancellation Loading Overlay */}
        {cancellationLoading && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-sm w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t('driver.cancellingOrder')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('driver.cancellingOrderDescription')}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Refresh Loading Overlay */}
        {refreshLoading && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-sm w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t('driver.refreshingData')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('driver.fetchingLatestInfo')}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Updated header section styled like MerchantOrderItemDetail */}
        <motion.div variants={itemVariants}>
          <Card className="duration-300 border-0 rounded-none mb-6">
            <CardHeader className="bg-[#FE8C00]">
              {isLoading ? (
                <div className="flex justify-between items-center">
                  <Skeleton className="h-7 w-32 bg-orange-200/50" />
                  <Skeleton className="h-6 w-20 bg-orange-200/50" />
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push('/application/driver-order-list')
                      }
                      className="text-white hover:bg-orange-600"
                      aria-label={t('common.goBack')}
                    >
                      <motion.div
                        variants={backButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </motion.div>
                    </Button>
                    <CardTitle className="text-xl font-semibold text-white">
                      {t('driver.orderNumber', {
                        number: orderDetail?.order_no || '--',
                      })}
                    </CardTitle>
                  </div>

                  {orderDetail && (
                    <Badge
                      className={`${getStatusConfig()?.color || 'bg-gray-500'} text-white text-center`}
                    >
                      {getStatusConfig()?.label || t('driver.unknown')}
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {isLoading ? (
          // Loading skeleton
          <div className="space-y-6">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : orderDetail ? (
          // Order details
          <>
            {/* Enhanced delivery status with progress indicator and refresh button */}
            <motion.div className="mb-6 px-2" variants={itemVariants}>
              <Card className="border border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-2">
                      {getStatusConfig()?.icon || (
                        <Truck className="h-5 w-5 text-orange-500" />
                      )}
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {t('driver.deliveryNumber', {
                            number: orderDetail.order_id,
                          })}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {orderDetail.delivery_status ===
                          DeliveryStatus.PREPARING
                            ? t('driver.preparingDescription')
                            : orderDetail.delivery_status ===
                                DeliveryStatus.READY
                              ? t('driver.readyDescription')
                              : orderDetail.delivery_status ===
                                  DeliveryStatus.DELIVERING
                                ? t('driver.deliveringDescription')
                                : t('driver.deliveredDescription')}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleRefresh}
                      className="flex items-center space-x-1.5 text-orange-600 hover:text-orange-700 bg-white border border-orange-200 hover:border-orange-300 rounded-lg px-3 py-1.5 shadow-sm transition-all duration-200 hover:shadow"
                      whileTap={{ scale: 0.95 }}
                      disabled={refreshLoading || statusUpdateLoading}
                    >
                      {refreshLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-1.5" />
                          <span className="text-sm font-medium">
                            {t('driver.refreshing')}
                          </span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {t('common.refresh')}
                          </span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Delivery Progress Bar */}
                  <div className="mt-2 mb-1">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-gray-600 uppercase">
                          {t('driver.deliveryProgress')}
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`${getStatusConfig()?.color || 'bg-gray-500'} text-white`}
                          >
                            {getStatusConfig()?.label || t('driver.unknown')}
                          </Badge>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              orderDetail.delivery_status ===
                              DeliveryStatus.PREPARING
                                ? '25%'
                                : orderDetail.delivery_status ===
                                    DeliveryStatus.READY
                                  ? '50%'
                                  : orderDetail.delivery_status ===
                                      DeliveryStatus.DELIVERING
                                    ? '75%'
                                    : '100%',
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            orderDetail.delivery_status ===
                            DeliveryStatus.PREPARING
                              ? 'bg-yellow-500'
                              : orderDetail.delivery_status ===
                                  DeliveryStatus.READY
                                ? 'bg-indigo-500'
                                : orderDetail.delivery_status ===
                                    DeliveryStatus.DELIVERING
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                          }`}
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Steps display */}
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <div
                      className={
                        orderDetail.delivery_status >= DeliveryStatus.PREPARING
                          ? 'text-yellow-700 font-medium'
                          : ''
                      }
                    >
                      {t('driver.preparing')}
                    </div>
                    <div
                      className={
                        orderDetail.delivery_status >= DeliveryStatus.READY
                          ? 'text-indigo-700 font-medium'
                          : ''
                      }
                    >
                      {t('driver.ready')}
                    </div>
                    <div
                      className={
                        orderDetail.delivery_status >= DeliveryStatus.DELIVERING
                          ? 'text-blue-700 font-medium'
                          : ''
                      }
                    >
                      {t('driver.delivering')}
                    </div>
                    <div
                      className={
                        orderDetail.delivery_status >= DeliveryStatus.COMPLETED
                          ? 'text-green-700 font-medium'
                          : ''
                      }
                    >
                      {t('driver.completed')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Info Card */}
            <motion.div variants={itemVariants} className="px-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t('driver.deliveryInformation')}
                  </CardTitle>
                  <CardDescription>
                    {t('driver.customerDetailsForDelivery')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('driver.customer')}
                      </p>
                      <p className="font-medium">{orderDetail.user_name}</p>
                      <p className="text-sm text-gray-600">
                        {orderDetail.user_email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-500">
                        {t('driver.contact')}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {orderDetail.user_phone_code} {orderDetail.user_phone}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                          onClick={() =>
                            copyToClipboard(
                              `${orderDetail.user_phone_code} ${orderDetail.user_phone}`
                            )
                          }
                          disabled={copyingPhone}
                          aria-label={t('driver.copyPhone')}
                        >
                          {copyingPhone ? (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </motion.div>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('driver.deliveryAddress')}
                      </p>
                      <p className="font-medium break-words">
                        {orderDetail.user_address}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t('driver.driver')}
                    </p>
                    <p className="font-medium">{orderDetail.driver_name}</p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Order Info Card */}
            <motion.div variants={itemVariants} className="px-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t('driver.orderInformation')}
                  </CardTitle>
                  <CardDescription>
                    {t('driver.orderPlacedOn', {
                      date: formatDate(orderDetail.order_date),
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-orange-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('driver.orderNumberLabel')}
                        </p>
                        <p className="font-medium">{orderDetail.order_no}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('driver.voucherNumber')}
                        </p>
                        <p className="font-medium">{orderDetail.voucher_no}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      {t('driver.orderTotal')}
                    </p>
                    <p className="text-2xl font-bold text-orange-500">
                      {orderDetail.order_total}
                    </p>
                  </div>

                  {/* Add status indicator section */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      {getStatusConfig()?.icon}
                      <div className="ml-2">
                        <p className="text-sm text-gray-500">
                          {t('driver.currentStatus')}
                        </p>
                        <p
                          className={`font-medium ${getStatusConfig()?.textColor || 'text-gray-900'}`}
                        >
                          {getStatusConfig()?.label || t('driver.unknown')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {canUpdateStatus() && (
                  <CardFooter
                    className={`flex ${orderDetail?.delivery_status === DeliveryStatus.PREPARING ? 'flex-col gap-y-3' : ''}`}
                  >
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          disabled={isUpdating || statusUpdateLoading}
                        >
                          {getStatusConfig()?.buttonLabel}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {t('driver.confirmStatusUpdate')}
                          </DialogTitle>
                          <DialogDescription>
                            {t('driver.confirmStatusQuestion')}
                            <span className="font-medium">
                              {' '}
                              {getTranslatedStatusLabel(
                                getStatusConfig()?.nextStatus as DeliveryStatus
                              )}
                            </span>
                            ?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-y-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            {t('common.cancel')}
                          </Button>
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() =>
                              handleStatusUpdate(
                                getStatusConfig()?.nextStatus as number
                              )
                            }
                            disabled={isUpdating || statusUpdateLoading}
                          >
                            {isUpdating
                              ? t('driver.updating')
                              : t('driver.confirm')}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Cancel Button - Only show for PREPARING status */}
                    {orderDetail?.delivery_status ===
                      DeliveryStatus.PREPARING && (
                      <AnimatePresence>
                        <motion.div
                          className="w-full"
                          variants={cancelButtonVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Dialog
                            open={isCancelDialogOpen}
                            onOpenChange={setIsCancelDialogOpen}
                          >
                            <motion.div
                              className="w-full"
                              whileHover="hover"
                              whileTap="tap"
                              variants={cancelButtonVariants}
                            >
                              <Button
                                variant="outline"
                                className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 mt-2 transition-all duration-200"
                                disabled={isCancelling}
                                onClick={handleOpenCancelDialog}
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                {t('driver.cancelOrder')}
                              </Button>
                            </motion.div>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-red-600 flex items-center">
                                  <AlertCircle className="mr-2 h-5 w-5" />
                                  {t('driver.confirmCancellation')}
                                </DialogTitle>
                                <DialogDescription>
                                  {t('driver.cancelOrderDescription')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-2">
                                <div className="grid gap-2">
                                  <label
                                    htmlFor="cancel-reason"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    {t('driver.cancellationReason')}
                                    <span className="ml-1 text-xs text-gray-500">
                                      ({t('driver.forRecordsOnly')})
                                    </span>
                                  </label>
                                  <textarea
                                    id="cancel-reason"
                                    className="flex h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={t('driver.reasonPlaceholder')}
                                    value={cancelReason}
                                    onChange={event =>
                                      setCancelReason(event.target.value)
                                    }
                                  />
                                </div>

                                {/* Warning Notice */}
                                <motion.div
                                  className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-amber-800">
                                      {t('driver.warningNotice')}
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                      {t('driver.cancellationWarning')}
                                    </p>
                                  </div>
                                </motion.div>
                              </div>
                              <DialogFooter className="gap-y-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setCancelReason('');
                                    setIsCancelDialogOpen(false);
                                  }}
                                >
                                  {t('common.back')}
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={handleCancelOrder}
                                  disabled={isCancelling}
                                >
                                  {isCancelling ? (
                                    <>
                                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      {t('driver.cancelling')}
                                    </>
                                  ) : (
                                    t('driver.confirmCancel')
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </CardFooter>
                )}
              </Card>
            </motion.div>

            {/* Pickup Info Card */}
            <motion.div variants={itemVariants} className="px-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t('driver.pickupInformation')}
                  </CardTitle>
                  <CardDescription>
                    {t('driver.merchantDetailsForPickup')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('driver.merchant')}
                      </p>
                      <p className="font-medium">{orderDetail.merchant_name}</p>
                      <p className="text-sm text-gray-600">
                        {t('driver.idLabel')}: {orderDetail.merchant_id}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          // Error or no data state
          <motion.div className="text-center py-12" variants={itemVariants}>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('driver.orderNotFound')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('driver.orderDetailsNotRetrieved')}
            </p>
            <Button onClick={handleRefresh}>{t('common.tryAgain')}</Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default DriverOrderDetail;
