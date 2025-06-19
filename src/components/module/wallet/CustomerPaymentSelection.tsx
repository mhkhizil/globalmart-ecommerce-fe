'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import Loader from '@/components/common/loader/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/core/dtos/order/CreateOrderReqeustDto';
import { useCreateOrder } from '@/lib/hooks/service/order/useCreateOrder';
import { useGetCustomerWallet } from '@/lib/hooks/service/payment/useGetCustomerWallet';
import { useSession } from '@/lib/hooks/session/useSession';
import { useCart } from '@/lib/hooks/store/useCart';
import { useShippingAddress } from '@/lib/hooks/store/useShippingAddress';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

// Payment method options for the UI
const paymentMethods = [
  {
    id: 'wallet',
    name: 'Wallet',
    icon: '/api/placeholder/32/20',
    details: 'Digital Wallet',
    type: 'digital',
  },
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    icon: '/api/placeholder/32/20',
    details: 'Pay when delivered',
    type: 'cash',
  },
];

// Map payment method to API enum
const mapPaymentMethod = (method: string): PaymentMethod => {
  if (method === 'wallet') {
    return PaymentMethod.WALLET;
  }
  if (method === 'cash_on_delivery') {
    return PaymentMethod.COD;
  }
  // For visa, paypal, maestro, apple_pay and any other method, default to COD
  return PaymentMethod.COD;
};

// Define the PaymentFormData type
type PaymentFormData = {
  payment_method: 'wallet' | 'cash_on_delivery';
};

function CustomerPaymentMethod() {
  const router = useRouter();
  const { data: sessionUser } = useSession();
  const { items, totalPrice, appliedCoupon, clearCart, totalItems } = useCart();
  const t = useTranslations();

  // Create the schema inside the component to access the translation hook
  const paymentFormSchema = useMemo(() => {
    return z.object({
      payment_method: z.enum(['wallet', 'cash_on_delivery'], {
        required_error: t('payment.pleaseSelectPaymentMethod'),
      }),
    });
  }, [t]);

  const { currentAddress } = useShippingAddress();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >();
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch wallet balance if available
  const { data: walletData, isLoading: isWalletLoading } = useGetCustomerWallet(
    sessionUser?.user?.id?.toString() || '',
    {
      enabled: !!sessionUser?.user?.id,
    }
  );

  // Calculate totals from real cart data
  const orderAmount: number = Number(totalPrice) || 0;
  const shippingAmount: number = orderAmount > 0 ? 30 : 0; // Free shipping on empty cart
  const couponDiscount: number = appliedCoupon?.discount_amount || 0;
  const totalAmount: number = orderAmount + shippingAmount - couponDiscount;

  // Check wallet balance if wallet payment is selected
  const walletBalance = Number(walletData?.wallet_amount) || 0;
  const hasInsufficientWallet =
    selectedPaymentMethod === 'wallet' && walletBalance < totalAmount;

  // Form setup with validation
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      payment_method: undefined,
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
      setOrderError(null); // Clear error when payment method changes
    }
  }, [watchedPaymentMethod, selectedPaymentMethod]);

  // Order creation mutation
  const { mutateAsync: createOrder, isPending } = useCreateOrder({
    onSuccess: () => {
      clearCart(); // This clears both cart items and applied coupon
      toast.success(
        t('payment.orderSubmittedSuccess') || 'Order placed successfully!'
      );
      router.push('/application/user-order-list');
    },
    onError: error => {
      setIsSubmitting(false);
      const errorMessage =
        error.message ||
        t('payment.orderSubmissionFailed') ||
        'Failed to place order';
      setOrderError(errorMessage);
      toast.error(errorMessage);
      console.error('Order submission error:', error);
    },
  });

  // Handle payment method selection
  const handlePaymentMethodSelect = useCallback(
    (method: string) => {
      setValue('payment_method', method as PaymentFormData['payment_method']);
      setSelectedPaymentMethod(method);
      setOrderError(null); // Clear any previous errors
    },
    [setValue]
  );

  // Enhanced validation before order submission
  const validateOrder = useCallback((): string | null => {
    if (!sessionUser) {
      return t('payment.loginRequired') || 'Please login to continue';
    }

    if (items.length === 0) {
      return t('payment.emptyCart') || 'Your cart is empty';
    }

    if (!selectedPaymentMethod) {
      return (
        t('payment.selectPaymentMethod') || 'Please select a payment method'
      );
    }

    if (selectedPaymentMethod === 'wallet') {
      if (isWalletLoading) {
        return 'Loading wallet information...';
      }

      if (walletBalance < totalAmount) {
        return `Insufficient wallet balance. You have ₹${convertThousandSeparator(walletBalance, 2)} but need ₹${convertThousandSeparator(totalAmount, 2)}`;
      }
    }

    // Validate cart items
    for (const item of items) {
      if (!item.merchant_id) {
        return 'Invalid item in cart. Please remove and re-add items.';
      }

      if (item.quantity <= 0) {
        return `Invalid quantity for ${item.name}`;
      }

      if (item.price <= 0) {
        return `Invalid price for ${item.name}`;
      }
    }

    return null;
  }, [
    sessionUser,
    items,
    selectedPaymentMethod,
    isWalletLoading,
    walletBalance,
    totalAmount,
    t,
  ]);

  // Handle order submission
  const onSubmit = useCallback(
    async (data: PaymentFormData) => {
      setIsSubmitting(true);
      setOrderError(null);

      // Validate order before submission
      const validationError = validateOrder();
      if (validationError) {
        setOrderError(validationError);
        toast.error(validationError);
        setIsSubmitting(false);
        return;
      }

      try {
        // Format date as DD/MM/YYYY
        const currentDate = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Since we now enforce same merchant in cart, we can create a single order
        const orderData = {
          date: currentDate,
          payment_method: mapPaymentMethod(data.payment_method),
          merchant_id: items[0].merchant_id, // All items have the same merchant_id
          ...(appliedCoupon && { coupon_id: appliedCoupon.id }), // Include coupon_id if coupon is applied
          order_items: items.map(item => ({
            product_id: item.id, // Using cart item id as product_id
            product_detail_id: item.id, // Using cart item id as product_detail_id (you may need to store this separately)
            merchant_id: item.merchant_id,
            name: item.name,
            quantity: item.quantity,
            discount_amt: item.discount_amount
              ? Number(item.discount_amount)
              : item.discount_price && item.price > item.discount_price
                ? Number((item.price - item.discount_price).toFixed(2))
                : 0,
            price: item.price.toFixed(2),
          })),
        };

        await createOrder(orderData);

        toast.success(`Order placed successfully with ${data.payment_method}!`);
      } catch (error: any) {
        console.error('Order submission error:', error);

        // Set specific error message
        const errorMessage =
          error.message || 'Failed to place order. Please try again.';
        setOrderError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [items, createOrder, appliedCoupon, validateOrder]
  );

  // Redirect to cart if empty
  if (items.length === 0) {
    router.push('/application/cart');
    return null;
  }

  if (isPending || isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button
          onClick={() => router.back()}
          className="p-1"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {t('payment.checkout')}
        </h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Order Summary */}
        <div className="mb-6">
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Order</span>
              <span>₹ {convertThousandSeparator(orderAmount, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹ {shippingAmount}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount ({appliedCoupon.coupon_code})</span>
                <span>- ₹ {convertThousandSeparator(couponDiscount, 2)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹ {convertThousandSeparator(totalAmount, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

          {/* Show error message if there is one */}
          {orderError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Order Error
                </h4>
                <p className="text-sm text-red-700 mt-1">{orderError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {paymentMethods.map(method => {
              // Check if this is wallet payment and show balance info
              const isWalletMethod = method.id === 'wallet';
              const showWalletInfo = isWalletMethod && !isWalletLoading;
              const isWalletInsufficient =
                isWalletMethod && hasInsufficientWallet;

              return (
                <div key={method.id}>
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      isWalletInsufficient
                        ? 'border-red-300 bg-red-50'
                        : selectedPaymentMethod === method.id
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-5 bg-gray-100 rounded">
                        {method.name === 'Visa' && (
                          <span className="text-xs font-bold text-blue-600">
                            VISA
                          </span>
                        )}
                        {method.name === 'PayPal' && (
                          <span className="text-xs font-bold text-blue-600">
                            PP
                          </span>
                        )}
                        {method.name === 'Maestro' && (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                        {method.name === 'Apple Pay' && (
                          <span className="text-xs font-bold text-gray-800">
                            🍎
                          </span>
                        )}
                        {method.name === 'Wallet' && (
                          <span className="text-xs font-bold text-green-600">
                            💳
                          </span>
                        )}
                        {method.name === 'Cash on Delivery' && (
                          <span className="text-xs font-bold text-orange-600">
                            💵
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {method.details}
                        </span>
                        {showWalletInfo && (
                          <span
                            className={`text-xs mt-1 ${
                              isWalletInsufficient
                                ? 'text-red-600'
                                : 'text-green-600'
                            }`}
                          >
                            Balance: ₹
                            {convertThousandSeparator(walletBalance, 2)}
                            {isWalletInsufficient && ' (Insufficient)'}
                          </span>
                        )}
                        {isWalletMethod && isWalletLoading && (
                          <span className="text-xs text-gray-500 mt-1">
                            Loading balance...
                          </span>
                        )}
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => handlePaymentMethodSelect(method.id)}
                      disabled={isWalletInsufficient}
                      className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500 disabled:opacity-50"
                    />
                  </label>

                  {/* Show insufficient wallet warning */}
                  {isWalletInsufficient &&
                    selectedPaymentMethod === method.id && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-red-800 font-medium">
                              Insufficient Wallet Balance
                            </p>
                            <p className="text-red-700 mt-1">
                              You need ₹
                              {convertThousandSeparator(
                                totalAmount - walletBalance,
                                2
                              )}{' '}
                              more to complete this order.
                            </p>
                            <Link
                              href="/application/customer-refill-wallet"
                              className="text-red-600 underline hover:text-red-800 text-sm font-medium"
                            >
                              Refill Wallet
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}

            {/* Show validation errors */}
            {errors.payment_method && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-800 text-sm font-medium">
                    {errors.payment_method.message}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t bg-white px-4 py-4">
        {/* Show order validation summary */}
        {(hasInsufficientWallet || orderError) && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-800 font-medium">
                  {hasInsufficientWallet
                    ? 'Cannot proceed with wallet payment'
                    : 'Please resolve the issue to continue'}
                </p>
                {hasInsufficientWallet && (
                  <p className="text-yellow-700 mt-1">
                    Select Cash on Delivery or refill your wallet to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={
            !selectedPaymentMethod ||
            isPending ||
            isSubmitting ||
            hasInsufficientWallet
          }
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending || isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : hasInsufficientWallet ? (
            'Insufficient Funds'
          ) : (
            'Continue'
          )}
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center space-x-8 bg-white py-4 border-t">
        <Link
          href="/application/home"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span className="text-xs text-gray-600">Home</span>
        </Link>
        <Link
          href="/application/wishlist"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span className="text-xs text-gray-600">Wishlist</span>
        </Link>
        <Link
          href="/application/cart"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span className="text-xs text-red-500">Cart</span>
        </Link>
        <Link
          href="/application/search"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span className="text-xs text-gray-600">Search</span>
        </Link>
        <Link
          href="/application/setting"
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span className="text-xs text-gray-600">Setting</span>
        </Link>
      </div>
    </div>
  );
}

export default CustomerPaymentMethod;
