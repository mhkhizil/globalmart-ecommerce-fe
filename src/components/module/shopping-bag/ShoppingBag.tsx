'use client';

import { ArrowLeft, ChevronDown, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CouponIcon from '@/components/common/icons/CouponIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShoppingBagProps {
  // Optional props can be added here if needed
}

export function ShoppingBag({}: ShoppingBagProps) {
  const router = useRouter();
  const t = useTranslations();
  const [quantity, setQuantity] = useState(1);

  // This would normally be fetched from a state management system or API
  const productData = {
    name: "Women's Casual Wear",
    description: 'Checked Single-Breasted Blazer',
    size: '42',
    delivery: '10 May 2XXX',
    price: 7000.0,
    image: '/product-image.jpg', // You'll need to add this image to your public folder
    currency: '₹',
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => router.back()}
          className="p-1"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">Shopping Bag</h1>
        <button className="p-1" aria-label="Add to favorites">
          <Heart size={24} />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex p-4 border-b">
        <div className="relative w-24 h-32 mr-4">
          <Image
            src={productData.image}
            alt={productData.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-lg font-medium">{productData.name}</h2>
            <p className="text-sm text-gray-700 mb-2">
              {productData.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Size</span>
                <div className="flex items-center border rounded-md px-3 py-1">
                  <span className="text-sm mr-1">{productData.size}</span>
                  <ChevronDown size={16} />
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Qty</span>
                <div className="flex items-center border rounded-md px-3 py-1">
                  <span className="text-sm mr-1">{quantity}</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Delivery by</span>
              <span className="text-sm ml-2">{productData.delivery}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <CouponIcon className="text-gray-800 mr-2" />
          <span className="font-medium">Apply Coupons</span>
        </div>
        <span className="text-rose-500 font-medium">Select</span>
      </div>

      {/* Payment Details */}
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg mb-4">Order Payment Details</h3>

        <div className="flex justify-between mb-3">
          <span className="text-gray-800">Order Amounts</span>
          <span className="font-medium">
            {productData.currency} {productData.price.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">Convenience</span>
            <span className="text-xs text-blue-500 underline">Know More</span>
          </div>
          <span className="text-rose-500 font-medium">Apply Coupon</span>
        </div>

        <div className="flex justify-between mb-3">
          <span className="text-gray-800">Delivery Fee</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
      </div>

      {/* Order Total */}
      <div className="p-4 border-b">
        <div className="flex justify-between mb-3">
          <span className="font-medium">Order Total</span>
          <span className="font-medium">
            {productData.currency} {productData.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-gray-800 mr-2">EMI Available</span>
          <span className="text-xs text-rose-500">Details</span>
        </div>
      </div>

      {/* Bottom Payment Bar */}
      <div className="mt-auto p-4 border-t flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-lg">
            {productData.currency} {productData.price.toFixed(2)}
          </span>
          <span className="text-xs text-blue-500 underline">View Details</span>
        </div>

        <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}

export default ShoppingBag;
