'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import BackIcon from '@/components/common/icons/BackIcon';
import Loader from '@/components/common/loader/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/core/dtos/order/CreateOrderReqeustDto';
import { useCreateOrder } from '@/lib/hooks/service/order/useCreateOrder';
import { useGetCustomerWallet } from '@/lib/hooks/service/payment/useGetCustomerWallet';
import { useSession } from '@/lib/hooks/session/useSession';
import { useCart } from '@/lib/hooks/store/useCart';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';
import { useShippingAddress } from '@/lib/hooks/store/useShippingAddress';

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
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Button hover animation
const buttonHoverVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

// Define the PaymentFormData type
type PaymentFormData = {
  payment_method: 'wallet' | 'cash_on_delivery';
};

function CustomerPaymentMethod() {
  const router = useRouter();
  const t = useTranslations();

  // Create the schema inside the component to access the translation hook
  const paymentFormSchema = useMemo(() => {
    return z.object({
      payment_method: z.enum(['wallet', 'cash_on_delivery'], {
        required_error: t('payment.pleaseSelectPaymentMethod'),
      }),
    });
  }, [t]);

  const { data: session } = useSession();
  const sessionUser = useMemo(() => session?.user, [session?.user]);
  const { items, clearCart } = useCart();
  const { currentAddress } = useShippingAddress();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'wallet' | 'cash_on_delivery' | undefined
  >();

  // Get merchant ID from the first item (assuming all items are from the same merchant)
  // const merchantId = useMemo(
  //   () => (items[0]?.merchant_id || '').toString(),
  //   [items]
  // );

  // Fetch wallet balance
  const { data: walletData, isLoading: isLoadingWallet } = useGetCustomerWallet(
    sessionUser?.id.toString() || '',
    {
      enabled: !!sessionUser,
    }
  );

  // Calculate total cost
  const totalCost = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }, [items]);

  const formattedTotalCost = useMemo(() => {
    return convertThousandSeparator(totalCost, 2);
  }, [totalCost]);

  // Form setup with validation
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      payment_method: undefined as unknown as 'wallet',
    },
  });

  // Watch payment method to update UI
  const watchedPaymentMethod = watch('payment_method');

  // Update selected payment method when form value changes
  useEffect(() => {
    if (
      watchedPaymentMethod &&
      watchedPaymentMethod !== selectedPaymentMethod
    ) {
      setSelectedPaymentMethod(watchedPaymentMethod);
    }
  }, [watchedPaymentMethod, selectedPaymentMethod]);

  // Order creation mutation
  const { mutateAsync: createOrder, isPending } = useCreateOrder({
    onSuccess: () => {
      clearCart();
      toast.success(t('payment.orderSubmittedSuccess'));
      //router.push('/application/user-order-list');
    },
    onError: error => {
      toast.error(t('payment.orderSubmissionFailed'));
      console.error('Order submission error:', error);
    },
  });

  // Check if wallet has sufficient balance
  const hasSufficientBalance = useMemo(() => {
    if (!walletData) return false;
    return Number(walletData.wallet_amount) >= totalCost;
  }, [walletData, totalCost]);

  // Handle payment method selection
  const handlePaymentMethodSelect = useCallback(
    (method: 'wallet' | 'cash_on_delivery') => {
      // If selecting wallet, check if balance is sufficient
      if (method === 'wallet' && !hasSufficientBalance) {
        toast.error(t('payment.insufficientBalance'));
        return;
      }

      setValue('payment_method', method);
      setSelectedPaymentMethod(method);
    },
    [setValue, hasSufficientBalance, t]
  );

  // Handle order submission
  const onSubmit = useCallback(
    async (data: PaymentFormData) => {
      if (!sessionUser) {
        toast.error(t('payment.loginRequired'));
        return;
      }

      if (items.length === 0) {
        toast.error(t('payment.emptyCart'));
        return;
      }

      if (!data.payment_method) {
        toast.error(t('payment.selectPaymentMethod'));
        return;
      }

      // Check for shipping address
      if (!currentAddress) {
        toast.error(t('shipping.noAddressFound'));
        router.push('/application/shipping/address');
        return;
      }

      // If payment method is wallet, check if balance is sufficient
      if (data.payment_method === 'wallet' && !hasSufficientBalance) {
        toast.error(t('payment.insufficientBalance'));
        return;
      }

      try {
        const currentDate = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        await createOrder({
          date: currentDate,
          payment_method:
            data.payment_method === 'wallet'
              ? PaymentMethod.WALLET
              : PaymentMethod.COD,
          order_items: items.map(item => ({
            name: item.name,
            price: item.price.toString(),
            product_id: item.id,
            quantity: item.quantity,
            discount_amt: 0,
            merchant_id: item.merchant_id,
          })),
          // Shipping address would be included here in a real implementation
          shipping_address: currentAddress && {
            full_name: currentAddress.fullName,
            address_line1: currentAddress.addressLine1,
            address_line2: currentAddress.addressLine2 || '',
            city: currentAddress.city,
            state: currentAddress.state,
            zip_code: currentAddress.zipCode,
            phone: currentAddress.phone,
          },
        });
      } catch {
        // Error is handled in the onError callback of useCreateOrder
      }
    },
    [
      items,
      createOrder,
      sessionUser,
      hasSufficientBalance,
      currentAddress,
      router,
      t,
    ]
  );

  // If no items in cart, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      router.push('/application/cart');
    }
  }, [items, router]);

  return (
    <div className="h-[92dvh] w-full overflow-y-auto scrollbar-none">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex w-full items-center justify-between px-[1.5rem] pt-[0.75rem] flex-shrink-0 sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} aria-label={t('common.goBack')}>
          <BackIcon />
        </button>
        <span className="text-[1rem] font-semibold">
          {t('payment.payment')}
        </span>
        <div style={{ width: '24px' }}></div> {/* Placeholder for alignment */}
      </div>

      <motion.div
        className="px-6 py-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Shipping Address Section */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[1.25rem] font-semibold">
              {t('shipping.shippingAddress')}
            </h2>
            <Button
              onClick={() => router.push('/application/shipping/address')}
              variant="ghost"
              className="text-[#FE8C00] hover:text-[#e07e00] hover:bg-[#FE8C00]/10 p-1 h-auto"
            >
              {t('shipping.editAddress')}
            </Button>
          </div>
          <Card className="border-[#EDEDED] shadow-sm">
            <CardContent className="p-4">
              {currentAddress ? (
                <>
                  <p className="font-semibold">{currentAddress.fullName}</p>
                  <p>{currentAddress.addressLine1}</p>
                  {currentAddress.addressLine2 && (
                    <p>{currentAddress.addressLine2}</p>
                  )}
                  <p>
                    {currentAddress.city}, {currentAddress.state}{' '}
                    {currentAddress.zipCode}
                  </p>
                  <p className="mt-1">{currentAddress.phone}</p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <p className="text-[#878787] mb-2">
                    {t('shipping.noAddressFound')}
                  </p>
                  <Button
                    onClick={() => router.push('/application/shipping/address')}
                    variant="outline"
                    className="border-[#FE8C00] text-[#FE8C00] hover:bg-[#FE8C00]/10"
                  >
                    {t('shipping.addNewAddress')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-[1.25rem] font-semibold mb-2">
            {t('payment.orderSummary')}
          </h2>
          <Card className="border-[#EDEDED] shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#878787] text-[0.875rem]">
                  {t('payment.totalItems')}
                </span>
                <span className="font-semibold">{`${items.length} ${t('payment.items')}`}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#878787] text-[0.875rem]">
                  {t('payment.deliveryFee')}
                </span>
                <span className="font-semibold">{t('payment.free')}</span>
              </div>
              <div className="border-t border-[#EDEDED] my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-[#878787] text-[0.875rem]">
                  {t('payment.total')}
                </span>
                <span className="font-semibold text-[1rem]">
                  ${formattedTotalCost}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Balance */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-[1.25rem] font-semibold mb-2">
            {t('payment.walletBalance')}
          </h2>
          <Card className="border-[#EDEDED] shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Wallet className="text-[#FE8C00] mr-2" size={20} />
                  <span className="text-[0.875rem]">
                    {t('payment.currentBalance')}
                  </span>
                </div>
                {isLoadingWallet ? (
                  <div className="flex ">
                    <Loader color="#f56565" />
                  </div>
                ) : (
                  <span className="font-semibold text-[1rem]">
                    $
                    {walletData
                      ? convertThousandSeparator(
                          Number(walletData.wallet_amount),
                          2
                        )
                      : '0.00'}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <Link href="/application/customer-wallet-refill">
                  <Button
                    variant="outline"
                    className="w-full border-[#FE8C00] text-[#FE8C00] hover:bg-[#FE8C00]/10 hover:text-[#FE8C00]"
                  >
                    <RefreshCw size={16} />
                    {t('payment.refillWallet')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-[1.25rem] font-semibold mb-2">
            {t('payment.paymentMethods')}
          </h2>

          <div className="space-y-4">
            {/* Wallet Payment Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPaymentMethod === 'wallet'
                  ? 'border-[#FE8C00] bg-[#FE8C00]/5'
                  : 'border-[#EDEDED]'
              }`}
              onClick={() => handlePaymentMethodSelect('wallet')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FE8C00]/10 flex items-center justify-center mr-3">
                    <Wallet className="text-[#FE8C00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('payment.wallet')}</h3>
                    <p className="text-[0.75rem] text-[#878787]">
                      {hasSufficientBalance
                        ? t('payment.payFromWallet')
                        : t('payment.insufficientBalanceWarning')}
                    </p>
                  </div>
                </div>
                {selectedPaymentMethod === 'wallet' && (
                  <CheckCircle2 className="text-[#FE8C00]" size={20} />
                )}
              </div>
            </motion.div>

            {/* Cash on Delivery Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPaymentMethod === 'cash_on_delivery'
                  ? 'border-[#FE8C00] bg-[#FE8C00]/5'
                  : 'border-[#EDEDED]'
              }`}
              onClick={() => handlePaymentMethodSelect('cash_on_delivery')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FE8C00]/10 flex items-center justify-center mr-3">
                    <CreditCard className="text-[#FE8C00]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {t('payment.cashOnDelivery')}
                    </h3>
                    <p className="text-[0.75rem] text-[#878787]">
                      {t('payment.payOnDelivery')}
                    </p>
                  </div>
                </div>
                {selectedPaymentMethod === 'cash_on_delivery' && (
                  <CheckCircle2 className="text-[#FE8C00]" size={20} />
                )}
              </div>
            </motion.div>
          </div>

          {errors.payment_method && (
            <p className="text-red-500 text-sm mt-2">
              {t('payment.pleaseSelectPaymentMethod')}
            </p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-auto">
          <motion.button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !selectedPaymentMethod}
            className={`w-full py-[1rem] rounded-[100px] font-semibold text-white transition-all ${
              !selectedPaymentMethod || isPending
                ? 'bg-[#FE8C00]/70 cursor-not-allowed'
                : 'bg-[#FE8C00] hover:bg-[#e07e00]'
            }`}
            initial="initial"
            whileHover={!isPending && selectedPaymentMethod ? 'hover' : ''}
            whileTap={!isPending && selectedPaymentMethod ? 'tap' : ''}
            variants={buttonHoverVariants}
          >
            {isPending ? <Loader /> : <span>{t('payment.placeOrder')}</span>}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CustomerPaymentMethod;
