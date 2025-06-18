'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CreditCard } from 'lucide-react';
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

  // Calculate totals from real cart data
  const orderAmount: number = Number(totalPrice) || 0;
  const shippingAmount: number = orderAmount > 0 ? 30 : 0; // Free shipping on empty cart
  const couponDiscount: number = appliedCoupon?.discount_amount || 0;
  const totalAmount: number = orderAmount + shippingAmount - couponDiscount;

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
    }
  }, [watchedPaymentMethod, selectedPaymentMethod]);

  // Order creation mutation
  const { mutateAsync: createOrder, isPending } = useCreateOrder({
    onSuccess: () => {
      clearCart(); // This clears both cart items and applied coupon
      toast.success(t('payment.orderSubmittedSuccess'));
      router.push('/application/user-order-list');
    },
    onError: error => {
      toast.error(t('payment.orderSubmissionFailed'));
      console.error('Order submission error:', error);
    },
  });

  // Handle payment method selection
  const handlePaymentMethodSelect = useCallback(
    (method: string) => {
      setValue('payment_method', method as PaymentFormData['payment_method']);
      setSelectedPaymentMethod(method);
    },
    [setValue]
  );

  // Handle order submission
  const onSubmit = useCallback(
    async (data: PaymentFormData) => {
      if (!sessionUser) {
        toast.error(t('payment.loginRequired'));
        return;
      }

      if (items.length === 0) {
        toast.error(t('payment.emptyCart') || 'Your cart is empty');
        router.push('/application/cart');
        return;
      }

      if (!data.payment_method) {
        toast.error(t('payment.selectPaymentMethod'));
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
      } catch (error) {
        console.error('Order submission error:', error);
        toast.error('Failed to place order. Please try again.');
      }
    },
    [sessionUser, t, items, router, createOrder, appliedCoupon]
  );

  // Redirect to cart if empty
  if (items.length === 0) {
    router.push('/application/cart');
    return null;
  }

  if (isPending) {
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {paymentMethods.map(method => (
              <div key={method.id}>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
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
                    <span className="font-medium text-gray-900">
                      {method.details}
                    </span>
                  </div>

                  <input
                    type="radio"
                    name="payment_method"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => handlePaymentMethodSelect(method.id)}
                    className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                </label>
              </div>
            ))}

            {/* Show validation errors */}
            {errors.payment_method && (
              <p className="text-red-500 text-sm mt-2">
                {errors.payment_method.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t bg-white px-4 py-4">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!selectedPaymentMethod || isPending}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full font-semibold text-lg"
        >
          {isPending ? 'Processing...' : 'Continue'}
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
