'use client';

import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import FallbackImage from '@/components/common/FallbackImage';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/hooks/session/useSession';
import { useCart } from '@/lib/hooks/store/useCart';
import { useShippingAddress } from '@/lib/hooks/store/useShippingAddress';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

interface ShoppingBagProps {
  // Optional props can be added here if needed
}

export function ShoppingBag({}: ShoppingBagProps) {
  const router = useRouter();
  const t = useTranslations();
  const { data: session } = useSession();
  const { currentAddress } = useShippingAddress();
  const { items, totalPrice, totalItems } = useCart();

  // Calculate totals
  const subtotal: number = Number(totalPrice) || 0;
  const deliveryFee: number = 0; // Free delivery
  const total: number = subtotal + deliveryFee;

  // Calculate discount information for an item
  const calculateItemDiscount = useCallback((item: any) => {
    if (!item.type || (!item.discount_percent && !item.discount_amount)) {
      return {
        hasDiscount: false,
        originalPrice: item.price,
        discountLabel: '',
        savings: 0,
      };
    }

    let originalPrice = item.price;
    let discountLabel = '';

    if (item.type === 'percentage' && item.discount_percent) {
      originalPrice = item.price / (1 - item.discount_percent / 100);
      discountLabel = `${item.discount_percent}% off`;
    } else if (item.type === 'fixed' && item.discount_amount) {
      originalPrice = item.price + Number(item.discount_amount);
      discountLabel = `$${convertThousandSeparator(Number(item.discount_amount), 2)} off`;
    }

    const savings = (originalPrice - item.price) * item.quantity;

    return {
      hasDiscount: true,
      originalPrice,
      discountLabel,
      savings,
    };
  }, []);

  // Generate mock variations for display (in real app, this would come from product data)
  const getMockVariations = useCallback((itemId: number) => {
    const variations = [
      { Black: true, Red: false },
      { Green: true, Grey: false },
      { Blue: true, White: false },
      { Navy: true, Beige: false },
    ];
    return variations[itemId % variations.length];
  }, []);

  // Generate mock rating for display (in real app, this would come from product data)
  const getMockRating = useCallback((itemId: number) => {
    const ratings = [4.8, 4.7, 4.5, 4.9, 4.6];
    return ratings[itemId % ratings.length];
  }, []);

  const handleProceedToPayment = () => {
    // Navigate to payment page
    router.push('/application/customer-payment-selection');
  };

  const handleEditAddress = () => {
    router.push('/application/shipping/address');
  };

  // If cart is empty, redirect back to cart
  if (items.length === 0) {
    router.push('/application/cart');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={() => router.back()}
          className="p-1"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Delivery Address Section */}
        <div className="bg-white p-4 mb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-gray-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Delivery Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Address :</p>
                  <p className="mt-1">
                    {currentAddress?.addressLine1 ||
                      "216 St Paul's Rd, London N1 2LL, UK"}
                  </p>
                  {currentAddress?.addressLine2 && (
                    <p>{currentAddress.addressLine2}</p>
                  )}
                  {currentAddress && (
                    <p>
                      {currentAddress.city}, {currentAddress.state}{' '}
                      {currentAddress.zipCode}
                    </p>
                  )}
                  <p className="mt-2">
                    <span className="font-medium">Contact :</span>{' '}
                    {currentAddress?.phone || '+44-784232'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleEditAddress}
              className="p-2 border border-gray-300 rounded-full"
              aria-label="Edit address"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Shopping List Section */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold text-gray-900 mb-4">Shopping List</h3>

          <div className="space-y-4">
            {items.map(item => {
              const discountInfo = calculateItemDiscount(item);
              const variations = getMockVariations(item.id);
              const rating = getMockRating(item.id);

              return (
                <div key={item.id} className="flex space-x-3">
                  <div className="relative w-16 h-20 flex-shrink-0">
                    <FallbackImage
                      src={item.image}
                      fallbackSrc="/food-fallback.png"
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.name}
                    </h4>

                    {/* Variations */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500">
                        Variations :
                      </span>
                      <div className="flex space-x-1">
                        {Object.entries(variations).map(
                          ([color, isSelected]) => (
                            <span
                              key={color}
                              className={`px-2 py-1 text-xs rounded ${
                                isSelected
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {color}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg
                            key={index}
                            className={`w-3 h-3 ${
                              index < Math.floor(rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{rating}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-900">
                        $ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      {discountInfo.hasDiscount && (
                        <>
                          <span className="text-xs text-red-500 bg-red-50 px-1 py-0.5 rounded">
                            upto {discountInfo.discountLabel}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ${' '}
                            {(
                              discountInfo.originalPrice * item.quantity
                            ).toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary in Shopping List */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Total Order ({totalItems}) :
              </span>
              <span className="font-bold text-gray-900">
                $ {subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Apply Coupons Section */}
        <div className="bg-white p-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-500 text-xs font-bold">%</span>
              </div>
              <span className="font-medium text-gray-900">Apply Coupons</span>
            </div>
            <span className="text-red-500 font-medium text-sm">Select</span>
          </div>
        </div>

        {/* Order Payment Details */}
        <div className="bg-white p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Order Payment Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Amounts</span>
              <span className="font-medium">$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Convenience</span>
                <button className="text-blue-500 text-xs underline">
                  Know More
                </button>
              </div>
              <span className="text-red-500 font-medium text-sm">
                Apply Coupon
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-green-600 font-medium">
                {deliveryFee === 0 ? 'Free' : `$ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Order Total</span>
                <span className="font-bold text-gray-900">
                  $ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-600 text-sm">EMI Available</span>
              <button className="text-red-500 text-xs underline">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Payment Bar */}
      <div className="bg-white border-t px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900">
              $ {total.toFixed(2)}
            </span>
            <button className="text-xs text-blue-500 underline text-left">
              View Details
            </button>
          </div>

          <Button
            onClick={handleProceedToPayment}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingBag;
