'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Info,
  Package,
  Phone,
  Pizza,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { OrderItemListResponseByVoucherNo } from '@/core/dtos/order/OrderListResponseDto';
import { OrderItem } from '@/core/entity/Order';
import { useAssignDriver } from '@/lib/hooks/service/merchant/useAssignDriver';
import { useGetDriverListByMerchantId } from '@/lib/hooks/service/merchant/useGetDriverListByMerchantId';
import { useGetOrderById } from '@/lib/hooks/service/order/useGetOrderById';
import { useGetOrderItemListByVoucherNo } from '@/lib/hooks/service/order/useGetOrderItemListByVoucherNo';
import { useUpdateOrderStatus } from '@/lib/hooks/service/order/useUpdateOrderStatus';
import { useSession } from '@/lib/hooks/session/useSession';

interface IOrderItemProps {
  id: string;
  translations?: any;
  detailTranslations?: any;
}

const statusColors = {
  1: 'bg-blue-600', // Pending
  2: 'bg-green-600', // Confirmed
  3: 'bg-yellow-600', // Shipped
  4: 'bg-red-600', // Cancelled
  5: 'bg-red-600', // Rejected
  6: 'bg-emerald-600', // Completed
} as const;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  },
  tap: { scale: 0.95 },
};

const confirmedVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { scale: 0, opacity: 0 },
};

// Animation for the Rejected status icon
const rejectedVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { scale: 0, opacity: 0 },
};

const dotVariants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const loadingContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation for the Back button
const backButtonVariants = {
  hover: { x: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

// Animation for related items section
const relatedItemsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const relatedItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -4,
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 },
  },
};

// Animation for driver assignment section
const driverSectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const driverCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 },
  },
  selected: {
    scale: 1.02,
    boxShadow: '0px 8px 20px rgba(99, 102, 241, 0.2)',
    border: '2px solid #4f46e5',
  },
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return '--';
  }
};

// Define a new interface for driver information
interface DriverInfo {
  id: number | null;
  name: string;
  contact_number: string;
  image?: string | null;
}

// Driver display component that takes driver info as a prop
const DriverDisplay = ({
  driver,
  isExisting,
}: {
  driver: DriverInfo;
  isExisting: boolean;
}) => {
  return (
    <div className="flex items-center p-3 bg-white rounded-lg border border-green-200">
      <div className="flex-shrink-0 mr-3">
        {driver.image ? (
          <img
            src={driver.image}
            alt={driver.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-xl">
            {driver.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{driver.name}</h4>
        <div className="flex items-center mt-1">
          <span className="text-xs text-gray-500">{driver.contact_number}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Badge className="bg-green-100 text-green-800">
            {isExisting ? 'Assigned' : 'On the way'}
          </Badge>
          <span className="text-xs text-gray-500">Driver ID: {driver.id}</span>
        </div>
      </div>
    </div>
  );
};

const MerchantOrderItemDetail = ({
  id,
  translations,
  detailTranslations,
}: IOrderItemProps) => {
  const t = translations || {};
  const detailT = detailTranslations || {};
  const { data: sessionData } = useSession();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const {
    data: orderItem,
    isLoading,
    refetch,
    error: fetchError,
  } = useGetOrderById(
    {
      merchant_id: sessionData?.user?.merchant_id || 0,
      order_id: Number.parseInt(id),
    },
    {
      enabled: !!sessionData?.user?.merchant_id,
    }
  );
  const queryClient = useQueryClient();
  const router = useRouter();

  // New state for related items expand/collapse
  const [isRelatedItemsOpen, setIsRelatedItemsOpen] = useState(true);

  // New state for driver assignment
  const [selectedDriverId, setSelectedDriverId] = useState<
    number | undefined
  >();
  const [isAssigningDriver, setIsAssigningDriver] = useState(false);
  const [isDriverAssigned, setIsDriverAssigned] = useState(false);
  const [showDriverSection, setShowDriverSection] = useState(true);

  // Define a new state to track if there's an existing driver assigned
  const [hasExistingDriver, setHasExistingDriver] = useState(false);

  // Toggle related items section
  const toggleRelatedItems = useCallback(() => {
    setIsRelatedItemsOpen(previous => !previous);
  }, []);

  // Toggle driver section
  const toggleDriverSection = useCallback(() => {
    setShowDriverSection(previous => !previous);
  }, []);

  const { data: session } = useSession();

  const { data: driverList, isLoading: isLoadingDrivers } =
    useGetDriverListByMerchantId(
      {
        merchant_id: session?.user?.merchant_id || 0,
      },
      {
        enabled: !!session?.user?.merchant_id,
      }
    );

  const { data: orderItemList, isLoading: isLoadingOrderItems } =
    useGetOrderItemListByVoucherNo(
      {
        order_id: orderItem?.order_id || 0,
        merchant_id: session?.user?.merchant_id || 0,
      },
      { enabled: !!orderItem?.order_id && !!session?.user?.merchant_id }
    );

  const {
    mutateAsync: assignDriverToOrder,
    isPending: isAssigningDriverLoading,
  } = useAssignDriver({
    onSuccess: () => {
      toast.success('Driver assigned successfully');
    },
  });

  // Use the updateOrderStatus hook for both confirm and reject operations
  const { mutateAsync: updateOrderStatus, isPending: isUpdatePending } =
    useUpdateOrderStatus({
      onSuccess: async () => {
        await refetch();
        setIsConfirming(false);
        setIsRejecting(false);
        setRejectRemark('');
        toast.success(
          isRejecting
            ? detailT('orderRejected') || 'Order rejected successfully'
            : detailT('orderAccepted') || 'Order confirmed successfully'
        );

        // Invalidate relevant queries to update UI
        try {
          await queryClient.invalidateQueries({
            queryKey: [
              'get-order-list-count',
              { merchant_id: orderItem?.merchant_id, status: 1 },
            ],
          });
          await queryClient.invalidateQueries({
            queryKey: [
              'get-order-list-count',
              {
                merchant_id: orderItem?.merchant_id,
                status: isRejecting ? 3 : 2,
              },
            ],
          });
          // Also invalidate any other related queries
          await queryClient.invalidateQueries({
            queryKey: ['get-order-list'],
          });

          await queryClient.invalidateQueries({
            queryKey: ['get-orderitem-by-voucher-no'],
          });
        } catch (error) {
          console.error('Error invalidating queries:', error);
        }
      },
      onError: error => {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(
          isRejecting
            ? `${detailT('failedToReject') || 'Failed to reject order'}: ${errorMessage}`
            : `${detailT('failedToConfirm') || 'Failed to confirm order'}: ${errorMessage}`
        );
        setIsConfirming(false);
        setIsRejecting(false);
      },
    });

  // Define isPending here, before it's used in any functions
  const isPending = isUpdatePending || isConfirming || isRejecting;

  // Reset state when order ID changes
  useEffect(() => {
    setIsConfirming(false);
    setIsRejecting(false);
    setShowRejectDialog(false);
    setRejectRemark('');
    setSelectedDriverId(undefined);
    setIsAssigningDriver(false);
    setIsDriverAssigned(false);
    setHasExistingDriver(false);
  }, [id]);

  // Check if driver is already assigned when order data is loaded
  useEffect(() => {
    if (orderItem) {
      const hasDriver = !!orderItem.driver_id && !!orderItem.driver_name;
      setHasExistingDriver(hasDriver);
      // Only set the driver ID if it's a valid number
      if (hasDriver && orderItem.driver_id !== null) {
        setSelectedDriverId(orderItem.driver_id);
      }
    }
  }, [orderItem]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (fetchError) {
      toast.error('Failed to load order details');
    }
  }, [fetchError]);

  const handleConfirm = useCallback(async () => {
    if (!orderItem) return;
    try {
      setIsConfirming(true);
      await updateOrderStatus({
        params: {
          order_id: orderItem.order_id.toString(),
          merchant_id: session?.user?.merchant_id || 0,
        },
        updateOrderStatusData: {
          status: 2, // Confirmed status
          remark: '',
        },
      });
    } catch (error) {
      console.error('Confirmation failed:', error);
      setIsConfirming(false);
    }
    setIsConfirming(false);
  }, [updateOrderStatus, orderItem, session?.user?.merchant_id]);

  const handleReject = useCallback(async () => {
    if (!orderItem) return;
    try {
      setIsRejecting(true);
      setShowRejectDialog(false);
      await updateOrderStatus({
        params: {
          order_id: orderItem.order_id.toString(),
          merchant_id: session?.user?.merchant_id || 0,
        },
        updateOrderStatusData: {
          status: 5, // Cancelled status (was previously 5, correct now)
          remark: rejectRemark.trim(),
        },
      });
    } catch (error) {
      console.error('Rejection failed:', error);
      setIsRejecting(false);
    }
  }, [updateOrderStatus, orderItem, rejectRemark, session?.user?.merchant_id]);

  const openRejectDialog = useCallback(() => {
    setShowRejectDialog(true);
    setRejectRemark('');
  }, []);

  const closeRejectDialog = useCallback(() => {
    setShowRejectDialog(false);
    setRejectRemark('');
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleRemarkChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRejectRemark(event.target.value);
    },
    []
  );

  // Handle keyboard events for the dialog
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        showRejectDialog &&
        !isPending &&
        rejectRemark.trim()
      ) {
        handleReject();
      } else if (event.key === 'Escape' && showRejectDialog) {
        closeRejectDialog();
      }
    },
    [showRejectDialog, isPending, rejectRemark, handleReject, closeRejectDialog]
  );

  // Handle driver selection
  const handleDriverSelect = useCallback((driverId: number) => {
    setSelectedDriverId(driverId);
  }, []);

  // Handle driver assignment
  const handleAssignDriver = useCallback(async () => {
    if (!selectedDriverId || !orderItem || !session?.user?.merchant_id) return;

    setIsAssigningDriver(true);

    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('merchant_id', session.user.merchant_id.toString());
      formData.append('order_id', orderItem.order_id.toString());
      formData.append('driver_id', selectedDriverId.toString());

      // Call the API
      await assignDriverToOrder(formData);

      // Update UI state
      setIsAssigningDriver(false);
      setIsDriverAssigned(true);

      // Refresh the order data
      await refetch();

      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: ['get-driver-list-by-merchant-id'],
      });
    } catch (error) {
      console.error('Error assigning driver:', error);
      setIsAssigningDriver(false);
      toast.error('Failed to assign driver. Please try again.');
    }
  }, [
    selectedDriverId,
    orderItem,
    session?.user?.merchant_id,
    assignDriverToOrder,
    refetch,
    queryClient,
  ]);

  // Create the wrapper component that handles the logic
  const DriverInfoWrapper = () => {
    // For existing driver from order data
    if (
      hasExistingDriver &&
      orderItem &&
      orderItem.driver_id &&
      orderItem.driver_name
    ) {
      const existingDriver: DriverInfo = {
        id: orderItem.driver_id,
        name: orderItem.driver_name,
        contact_number: orderItem.driver_contact_number || 'N/A',
      };

      // Try to get driver image from the driver list if available
      if (driverList?.drivers) {
        const driverWithImage = driverList.drivers.find(
          d => d.id === existingDriver.id
        );
        if (driverWithImage?.image) {
          existingDriver.image = driverWithImage.image;
        }
      }

      return <DriverDisplay driver={existingDriver} isExisting={true} />;
    }

    // For newly assigned driver
    if (selectedDriverId && driverList?.drivers) {
      const selectedDriver = driverList.drivers.find(
        d => d.id === selectedDriverId
      );
      if (selectedDriver) {
        const newlyAssignedDriver: DriverInfo = {
          id: selectedDriver.id,
          name: selectedDriver.name,
          contact_number: selectedDriver.contact_number || 'N/A',
          image: selectedDriver.image,
        };

        return (
          <DriverDisplay driver={newlyAssignedDriver} isExisting={false} />
        );
      }
    }

    // Default case - no driver info available
    return <div>No driver information available</div>;
  };

  // Define a new ContactButton component inside MerchantOrderItemDetail
  const ContactButton = () => {
    // For existing driver
    if (hasExistingDriver && orderItem?.driver_contact_number) {
      return (
        <a
          href={`tel:${orderItem.driver_contact_number}`}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
        >
          <Phone className="h-4 w-4 mr-1.5" />
          {orderItem.driver_contact_number}
        </a>
      );
    }

    // For newly assigned driver
    if (selectedDriverId && driverList?.drivers) {
      const driver = driverList.drivers.find(d => d.id === selectedDriverId);
      if (driver?.contact_number) {
        return (
          <a
            href={`tel:${driver.contact_number}`}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
          >
            <Phone className="h-4 w-4 mr-1.5" />
            {driver.contact_number}
          </a>
        );
      }
    }

    // Default case: no contact available
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        disabled
      >
        <Phone className="h-4 w-4 mr-1" /> No Contact
      </Button>
    );
  };

  const LoadingSkeleton = () => (
    <>
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="pt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>
    </>
  );

  const ConfirmedStatus = () => (
    <motion.div
      variants={confirmedVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center text-green-600"
    >
      <CheckCircle2 className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">Order Confirmed</span>
    </motion.div>
  );

  const RejectedStatus = () => (
    <motion.div
      variants={rejectedVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center text-red-600"
    >
      <XCircle className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">Order Rejected</span>
    </motion.div>
  );

  // Loading skeleton for related items
  const RelatedItemsLoadingSkeleton = () => (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(index => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
        ))}
      </div>
    </div>
  );

  // Loading skeleton for driver section
  const DriverSectionLoadingSkeleton = () => (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-1 gap-3 mt-3">
        {[1, 2].map(index => (
          <div key={index} className="flex items-center p-3 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="ml-3 space-y-1 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );

  // Status text with translation
  const getStatusText = (status: number, t: any) => {
    if (status === 1) return detailT('pending') || 'Pending';
    if (status === 2) return detailT('confirmed') || 'Confirmed';
    if (status === 3) return detailT('shipped') || 'Shipped';
    if (status === 4) return detailT('cancelled') || 'Cancelled';
    if (status === 5) return detailT('rejected') || 'Rejected';
    if (status === 6) return detailT('completed') || 'Completed';
    return detailT('unknown') || 'Unknown';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full mx-auto"
    >
      <Card className="duration-300 border-0 rounded-none">
        <CardHeader className="bg-[#FE8C00]">
          {isLoading || !orderItem ? (
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-white hover:bg-orange-600"
                  aria-label="Go back"
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
                  Order #{orderItem.voucher_no || ' --'}
                </CardTitle>
              </div>
              <Badge
                className={`${statusColors[orderItem.status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}
              >
                {getStatusText(orderItem.status, detailT)}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {isLoading || !orderItem ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{orderItem.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {orderItem.quantity}
                  </p>
                </div>
              </div> */}

              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <p className="text-sm text-gray-600">
                  {detailT('ordered') || 'Ordered'}: {orderItem.order_date}
                </p>
              </div>

              <div className="space-y-2">
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span>{orderItem.price}</span>
                </div>
                {orderItem.discount_amt > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{orderItem.discount_amt}</span>
                  </div>
                )} */}
                <div className="flex justify-between font-semibold">
                  <span>{detailT('total') || 'Total'}:</span>
                  <span>{orderItem.order_total}</span>
                </div>
              </div>

              {orderItem.merchant_name && (
                <p className="text-sm">
                  <span className="font-medium">
                    {detailT('merchant') || 'Merchant'}:
                  </span>{' '}
                  {orderItem.merchant_name}
                </p>
              )}
            </>
          )}
        </CardContent>
        <Toaster />
        <CardFooter className="flex justify-end pt-6 space-x-3">
          <AnimatePresence>
            {!isLoading && orderItem && (
              <>
                {orderItem.status === 1 ? (
                  <>
                    {/* Reject Button */}
                    <motion.div
                      key="reject-button"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        disabled={isPending}
                        onClick={openRejectDialog}
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      >
                        <motion.button
                          variants={buttonVariants}
                          whileHover={isPending ? {} : 'hover'}
                          whileTap={isPending ? {} : 'tap'}
                          disabled={isPending}
                          className="w-[150px]"
                        >
                          {isRejecting ? (
                            <motion.div
                              variants={loadingContainerVariants}
                              animate="animate"
                              className="flex items-center space-x-1"
                            >
                              <motion.span
                                variants={dotVariants}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                              <motion.span
                                variants={dotVariants}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                              <motion.span
                                variants={dotVariants}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            </motion.div>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              {detailT('rejectOrder') || 'Reject Order'}
                            </>
                          )}
                        </motion.button>
                      </Button>
                    </motion.div>

                    {/* Confirm Button */}
                    <motion.div
                      key="confirm-button"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Button
                        asChild
                        disabled={isPending}
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <motion.button
                          variants={buttonVariants}
                          whileHover={isPending ? {} : 'hover'}
                          whileTap={isPending ? {} : 'tap'}
                          disabled={isPending}
                          className="w-[150px]"
                        >
                          {isConfirming ? (
                            <motion.div
                              variants={loadingContainerVariants}
                              animate="animate"
                              className="flex items-center space-x-1"
                            >
                              <motion.span
                                variants={dotVariants}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                              <motion.span
                                variants={dotVariants}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                              <motion.span
                                variants={dotVariants}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            </motion.div>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {detailT('confirmOrder') || 'Confirm Order'}
                            </>
                          )}
                        </motion.button>
                      </Button>
                    </motion.div>
                  </>
                ) : orderItem.status === 2 ? (
                  <motion.div
                    key="confirmed-status"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ConfirmedStatus />
                  </motion.div>
                ) : orderItem.status === 4 || orderItem.status === 5 ? (
                  <motion.div
                    key="rejected-status"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <RejectedStatus />
                  </motion.div>
                ) : undefined}
              </>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>

      {/* Driver Assignment Section - Only shown when order is confirmed and no driver is assigned */}
      {!isLoading &&
        orderItem &&
        orderItem.status === 2 &&
        !isDriverAssigned &&
        !hasExistingDriver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mt-4 overflow-hidden border border-gray-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 py-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={toggleDriverSection}
                >
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-lg font-medium text-gray-800">
                      {hasExistingDriver
                        ? detailT('assignedDriver') || 'Assigned Driver'
                        : detailT('deliveryDriverAssigned') ||
                          'Delivery Driver Assigned'}
                    </CardTitle>
                  </div>
                  <motion.div
                    animate={{ rotate: showDriverSection ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {showDriverSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <CardContent className="p-4">
                      {isLoadingDrivers ? (
                        <DriverSectionLoadingSkeleton />
                      ) : (
                        <motion.div
                          variants={driverSectionVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="mb-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-medium text-gray-700 mb-1">
                                {detailT('availableDrivers') ||
                                  'Available Drivers'}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {detailT('selectDriverToDeliver') ||
                                  'Select a driver to deliver this order'}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1"
                              onClick={() =>
                                router.push('/application/register-driver')
                              }
                            >
                              <User className="h-3.5 w-3.5" />
                              <span>
                                {detailT('addNewDriver') || 'Add New Driver'}
                              </span>
                            </Button>
                          </div>

                          {!driverList || driverList.drivers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <User className="w-10 h-10 text-gray-300 mb-2" />
                              <p className="text-gray-500 mb-4">
                                {detailT('noDriversAvailable') ||
                                  'No drivers available at the moment'}
                              </p>
                              <Button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() =>
                                  router.push('/application/register-driver')
                                }
                              >
                                {detailT('registerNewDriver') ||
                                  'Register New Driver'}
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-4 mb-4 max-h-[400px] overflow-y-auto no-scrollbar">
                              {driverList.drivers.map(driver => (
                                <motion.div
                                  key={driver.id}
                                  variants={driverCardVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover="hover"
                                  className={`p-3 rounded-lg border ${
                                    selectedDriverId === driver.id
                                      ? 'border-indigo-500 bg-indigo-50'
                                      : 'border-gray-200 bg-white'
                                  } cursor-pointer`}
                                  onClick={() => handleDriverSelect(driver.id)}
                                >
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 mr-3">
                                      {driver.image ? (
                                        <img
                                          src={driver.image}
                                          alt={driver.name}
                                          className="w-12 h-12 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
                                          {driver.name.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-900 flex items-center">
                                            {driver.name}
                                            {selectedDriverId === driver.id && (
                                              <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                  type: 'spring',
                                                  stiffness: 500,
                                                  damping: 15,
                                                }}
                                              >
                                                <Check className="w-4 h-4 text-indigo-600 ml-1" />
                                              </motion.div>
                                            )}
                                          </h4>
                                          <div className="flex items-center mt-1">
                                            <span className="text-xs text-gray-500">
                                              ID: {driver.id}
                                            </span>
                                          </div>
                                        </div>
                                        <TooltipProvider delayDuration={300}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                                              >
                                                <Phone className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{driver.contact_number}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>

                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center">
                                          <Truck className="w-3 h-3 text-gray-400 mr-1" />
                                          <span className="text-xs text-gray-500">
                                            {driver.process || 'Available'}
                                          </span>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs">
                                          Since{' '}
                                          {new Date(
                                            driver.created_at
                                          ).toLocaleDateString()}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-end mt-4">
                            <Button
                              onClick={handleAssignDriver}
                              disabled={!selectedDriverId || isAssigningDriver}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              {isAssigningDriver ? (
                                <motion.div
                                  variants={loadingContainerVariants}
                                  animate="animate"
                                  className="flex items-center space-x-1"
                                >
                                  <motion.span
                                    variants={dotVariants}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                  <motion.span
                                    variants={dotVariants}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                  <motion.span
                                    variants={dotVariants}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                </motion.div>
                              ) : (
                                detailT('assignDriver') || 'Assign Driver'
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}

      {/* Driver Assigned Status Card - Shows when a driver is assigned */}
      {!isLoading &&
        orderItem &&
        orderItem.status === 2 &&
        (isDriverAssigned || hasExistingDriver) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mt-4 border border-gray-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 py-4">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg font-medium text-gray-800">
                    {hasExistingDriver
                      ? 'Assigned Driver'
                      : 'Delivery Driver Assigned'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DriverInfoWrapper />

                  <div className="flex justify-between items-center mt-4 px-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-green-600 mr-1.5" />
                      <span>
                        {hasExistingDriver
                          ? `${detailT('assignedBy') || 'Assigned by'} ${orderItem?.merchant_name || t('merchant') || 'merchant'}`
                          : `${detailT('assignedAt') || 'Assigned at'} ${new Date().toLocaleTimeString()}`}
                      </span>
                    </div>

                    {/* Use the ContactButton component */}
                    <ContactButton />
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      {/* New Section: Related Order Items from the same voucher */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mt-4 overflow-hidden border border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 py-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleRelatedItems}
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-lg font-medium text-gray-800">
                  {detailT('itemsInThisOrder') || 'Items in This Order'}
                </CardTitle>
              </div>
              <motion.div
                animate={{ rotate: isRelatedItemsOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </motion.div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {isRelatedItemsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CardContent className="p-0">
                  {isLoadingOrderItems ? (
                    <div className="px-6 py-4">
                      <RelatedItemsLoadingSkeleton />
                    </div>
                  ) : (
                    <motion.div
                      variants={relatedItemsVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-0"
                    >
                      <div className=" w-full rounded-md overflow-y-auto scrollbar-hide">
                        <div className="px-4 py-3">
                          {!orderItemList || orderItemList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <Info className="w-10 h-10 text-gray-300 mb-2" />
                              <p className="text-gray-500">
                                {detailT('noItemsFound') ||
                                  'No items found for this order'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {orderItemList.map((item, index) => (
                                <div key={index}>
                                  <motion.div
                                    variants={relatedItemVariants}
                                    whileHover="hover"
                                    className="bg-white p-3 rounded-lg border border-gray-100 cursor-pointer flex items-center"
                                  >
                                    {/* Item icon/image */}
                                    {/* <div className="flex-shrink-0 mr-3 bg-gradient-to-br from-indigo-50 to-blue-50 p-2 rounded-full">
                                      {item.category_name
                                        .toLowerCase()
                                        .includes('pizza') ? (
                                        <Pizza className="w-6 h-6 text-red-500" />
                                      ) : item.category_name
                                          .toLowerCase()
                                          .includes('drink') ||
                                        item.category_name
                                          .toLowerCase()
                                          .includes('beverage') ? (
                                        <Coffee className="w-6 h-6 text-amber-500" />
                                      ) : (
                                        <Coffee className="w-6 h-6 text-green-500" />
                                      )}
                                    </div> */}

                                    {/* Item details */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                          {item.product_name}
                                        </h4>
                                        <Badge
                                          className={`ml-2 ${
                                            item.status === 1
                                              ? 'bg-blue-100 text-blue-800'
                                              : item.status === 2
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {getStatusText(item.status, t)}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center">
                                          <Tag className="w-3 h-3 text-gray-400 mr-1" />
                                          <span className="text-xs text-gray-500">
                                            {item.category_name}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <span className="text-xs text-gray-500">
                                            {detailT('quantity') || 'Qty'}:{' '}
                                            {item.quantity}
                                          </span>
                                          <span className="text-sm font-medium text-gray-900">
                                            {item.price}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Arrow icon */}
                                    <motion.div
                                      whileHover={{ x: 2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                                    </motion.div>
                                  </motion.div>

                                  {index < orderItemList.length - 1 && (
                                    <Separator className="my-3 bg-gray-100" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {orderItemList && orderItemList.length > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium text-gray-700">
                              {detailT('totalItems') || 'Total Items'}:{' '}
                              <span className="text-indigo-600">
                                {orderItemList.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Confirmation Dialog for Rejection with Remark Input */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {detailT('rejectOrder') || 'Reject Order'}
            </DialogTitle>
            <DialogDescription>
              {detailT('rejectOrderConfirmation') ||
                'Are you sure you want to reject this order? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="text-sm font-medium mb-2 block">
              {detailT('rejectionReason') || 'Rejection Reason (Optional)'}
            </div>
            <Input
              id="reject-remark"
              placeholder={
                detailT('enterRejectionReason') || 'Enter reason for rejection'
              }
              value={rejectRemark}
              onChange={handleRemarkChange}
              onKeyDown={handleKeyDown}
              className="w-full"
              disabled={isPending}
              maxLength={255}
              autoFocus
            />
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeRejectDialog}
              disabled={isPending}
            >
              {detailT('cancel') || 'Cancel'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleReject}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? (
                <motion.div
                  variants={loadingContainerVariants}
                  animate="animate"
                  className="flex items-center space-x-1"
                >
                  <motion.span
                    variants={dotVariants}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.span
                    variants={dotVariants}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.span
                    variants={dotVariants}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </motion.div>
              ) : (
                detailT('rejectOrder') || 'Reject Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MerchantOrderItemDetail;
