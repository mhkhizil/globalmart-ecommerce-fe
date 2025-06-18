'use client';

import clsx from 'clsx';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import FallbackImage from '@/components/common/FallbackImage';
import EmptyCartIcon from '@/components/common/icons/EmptyCartIcon';
import { useSession } from '@/lib/hooks/session/useSession';
import { useCart } from '@/lib/hooks/store/useCart';
import { useGetProductDetailByMerchant } from '@/lib/hooks/service/product/useGetProductDetailByMerchant';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionUser = useMemo(() => session?.user, [session?.user]);
  const {
    items,
    totalPrice,
    totalItems,
    addItem,
    decreaseItemQuantity,
    removeItem,
  } = useCart();
  const t = useTranslations();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOtherItems, setShowOtherItems] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get merchant_id from the first item in cart for the API call
  const merchantId = items.length > 0 ? items[0].merchant_id : 1;

  // Fetch product details by merchant
  const { data: productDetailData, isLoading: isLoadingProducts } =
    useGetProductDetailByMerchant(
      {
        merchant_id: merchantId || 1,
        per_page: 30,
        page: 1,
      },
      {
        enabled: showOtherItems && !!merchantId, // Only fetch when section is expanded and we have merchant_id
      }
    );

  const formattedTotalPrice = useMemo(() => {
    return convertThousandSeparator(totalPrice, 2);
  }, [totalPrice]);

  // Process API data for display
  const otherItems = useMemo(() => {
    if (!productDetailData?.data?.product_details) return [];

    return productDetailData.data.product_details.map(item => ({
      id: item.id,
      name: item.product_name,
      price: parseFloat(item.price),
      image: item.product_detail_image[0]?.image_path || '/food-fallback.png',
      rating: 4.5, // Default rating since not provided in API
      originalPrice: item.discount_price ? parseFloat(item.price) : null,
      discount_percent: item.discount_percent,
      discount_amount: item.discount_amount
        ? parseFloat(item.discount_amount)
        : null,
      discount_price: item.discount_price
        ? parseFloat(item.discount_price)
        : null,
      type: item.discount_type,
      merchant_id: item.merchant_id,
      sku: item.sku,
      stock: item.stock,
      size: item.size,
      color_code: item.color_code,
      color_name: item.color_name,
      en_description: item.en_description,
    }));
  }, [productDetailData]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites(previous =>
      previous.includes(productId)
        ? previous.filter(id => id !== productId)
        : [...previous, productId]
    );
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!sessionUser) {
      toast.error(t('cart.pleaseLoginToSubmitOrder'));
      return;
    }

    if (items.length === 0) {
      toast.error(t('cart.yourCartIsEmpty'));
      return;
    }

    // Navigate to shopping bag (detailed checkout page)
    router.push('/application/shopping-bag');
  }, [sessionUser, router, t, items.length]);

  const navigateToProductList = useCallback(() => {
    router.push('/application/product/list');
  }, [router]);

  // Calculate discount information for display
  const calculateDiscountInfo = useCallback((item: any) => {
    if (!item.type || (!item.discount_percent && !item.discount_amount)) {
      return {
        hasDiscount: false,
        originalPrice: item.price,
        discountLabel: '',
      };
    }

    let originalPrice = item.price;
    let discountLabel = '';

    if (item.type === 'percentage' && item.discount_percent) {
      originalPrice = item.price / (1 - item.discount_percent / 100);
      discountLabel = `${item.discount_percent}% off`;
    } else if (item.type === 'fixed' && item.discount_amount) {
      originalPrice = item.price + Number(item.discount_amount);
      discountLabel = `₹${convertThousandSeparator(Number(item.discount_amount), 0)} off`;
    }

    return {
      hasDiscount: true,
      originalPrice,
      discountLabel,
    };
  }, []);

  // Calculate discount information for other items
  const calculateOtherItemDiscount = useCallback((item: any) => {
    if (!item.type || (!item.discount_percent && !item.discount_amount)) {
      return {
        hasDiscount: false,
        originalPrice: item.price,
        discountLabel: '',
      };
    }

    let originalPrice = item.originalPrice || item.price;
    let discountLabel = '';

    if (item.type === 'percentage' && item.discount_percent) {
      discountLabel = `${item.discount_percent}% off`;
    } else if (item.type === 'fixed' && item.discount_amount) {
      discountLabel = `₹${convertThousandSeparator(Number(item.discount_amount), 0)} off`;
    }

    return {
      hasDiscount: true,
      originalPrice,
      discountLabel,
    };
  }, []);

  // Scroll functions for horizontal navigation
  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -160, // Width of one card plus gap
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 160, // Width of one card plus gap
        behavior: 'smooth',
      });
    }
  }, []);

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current && isAutoScrolling) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        // If we've reached the end, scroll back to the beginning
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        } else {
          // Otherwise, scroll to the next item
          container.scrollBy({
            left: 160, // Width of one card plus gap
            behavior: 'smooth',
          });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds
  }, [isAutoScrolling]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsAutoScrolling(false);
    stopAutoScroll();
  }, [stopAutoScroll]);

  const handleMouseLeave = useCallback(() => {
    setIsAutoScrolling(true);
  }, []);

  // Start auto-scroll when component mounts and showOtherItems is true
  useEffect(() => {
    if (showOtherItems && isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => {
      stopAutoScroll();
    };
  }, [showOtherItems, isAutoScrolling, startAutoScroll, stopAutoScroll]);

  // Manual navigation should pause auto-scroll temporarily
  const handleManualScrollLeft = useCallback(() => {
    setIsAutoScrolling(false);
    scrollLeft();
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  }, [scrollLeft]);

  const handleManualScrollRight = useCallback(() => {
    setIsAutoScrolling(false);
    scrollRight();
    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  }, [scrollRight]);

  // Quantity management functions
  const handleIncreaseQuantity = useCallback(
    (item: any) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        merchant_id: item.merchant_id,
        discount_amount: item.discount_amount,
        discount_price: item.discount_price,
        customization: item.customization,
      });
      toast.success(`Added one more ${item.name}`);
    },
    [addItem]
  );

  const handleDecreaseQuantity = useCallback(
    (itemId: number, itemName: string) => {
      decreaseItemQuantity(itemId);
      toast.success(`Removed one ${itemName}`);
    },
    [decreaseItemQuantity]
  );

  const handleRemoveItem = useCallback(
    (itemId: number, itemName: string) => {
      removeItem(itemId);
      toast.success(`${itemName} removed from cart`);
    },
    [removeItem]
  );

  // Render empty cart state
  if (items.length === 0) {
    return (
      <div className="flex w-full h-full flex-col max-h-[92dvh] relative">
        <Toaster />
        <div className="flex w-full items-center justify-between px-[1.5rem] pt-[0.75rem] flex-shrink-0 sticky top-0 bg-white z-10">
          <button onClick={() => router.back()} aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
          <span className="text-[1rem] font-semibold">Shopping Bag</span>
          <button aria-label="Favorites">
            <Heart size={24} />
          </button>
        </div>

        <div className="flex w-full h-full flex-col items-center justify-start px-[1.75rem] pt-[3.5rem]">
          <EmptyCartIcon />
          <h2 className="mt-[3.5rem] text-[#101010] text-[1.5rem] leading-[2rem] font-[700]">
            {t('cart.ouchEmpty')}
          </h2>
          <p className="text-center mt-[1rem] text-[#878787] text-[1rem] leading-[1.5rem] font-[400]">
            {t('cart.seemsLikeYouHaveNotOrderedAnyFoodYet')}
          </p>

          <button
            onClick={navigateToProductList}
            className="flex w-full items-center mt-[2.5rem] justify-center bg-red-500 py-[1rem] rounded-[6.25rem] hover:bg-red-500/70 transition-colors"
          >
            <span className="text-white text-[0.875rem] leading-[1.25rem] font-[600]">
              {t('cart.findFoods')}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col max-h-[100dvh] relative bg-white">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex w-full items-center justify-between px-[1.5rem] pt-[0.75rem] pb-[0.75rem] flex-shrink-0 sticky top-0 bg-white z-10 border-b border-gray-100">
        <button onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <span className="text-[1.125rem] font-semibold text-gray-900">
          {t('cart.shoppingBag')}
        </span>
        <button aria-label="Favorites" onClick={() => setFavorites([])}>
          <Heart size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map(item => {
            const discountInfo = calculateDiscountInfo(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="flex p-4">
                  <div className="relative w-20 h-24 flex-shrink-0 mr-4">
                    <FallbackImage
                      src={item.image}
                      fallbackSrc="/food-fallback.png"
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          ₹
                          {convertThousandSeparator(
                            item.price * item.quantity,
                            0
                          )}
                        </span>
                        {discountInfo.hasDiscount && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              ₹
                              {convertThousandSeparator(
                                discountInfo.originalPrice * item.quantity,
                                0
                              )}
                            </span>
                            <span className="text-xs text-red-500 bg-red-50 px-1 py-0.5 rounded">
                              {discountInfo.discountLabel}
                            </span>
                          </>
                        )}
                      </div>
                      {item.merchant_id && (
                        <div className="text-xs text-gray-600 mb-2">
                          {t('cart.merchantId')}: {item.merchant_id}
                        </div>
                      )}
                      {item.customization && (
                        <div className="text-xs text-gray-600 mb-2">
                          {Object.entries(item.customization).map(
                            ([key, value]) => (
                              <span key={key} className="mr-2">
                                {t(`cart.customization.${key}`)}: {value}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(item.id, item.name)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label={t('cart.decreaseQuantity')}
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label={t('cart.increaseQuantity')}
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Remove Item Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        aria-label={t('cart.removeItem')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="self-start ml-2"
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      size={20}
                      className={clsx(
                        'transition-colors',
                        favorites.includes(item.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-400'
                      )}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Items from Same Merchant Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowOtherItems(!showOtherItems)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-base font-semibold text-gray-900">
              {t('cart.moreFromRestaurant')}
            </h3>
            {showOtherItems ? (
              <ChevronUp size={20} className="text-gray-600" />
            ) : (
              <ChevronDown size={20} className="text-gray-600" />
            )}
          </button>

          {showOtherItems && (
            <div className="border-t border-gray-200">
              <div
                className="p-4 relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    <span className="ml-2 text-gray-600">
                      Loading products...
                    </span>
                  </div>
                ) : otherItems.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-gray-500">
                      No other products available from this merchant
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Navigation Buttons */}
                    <button
                      onClick={handleManualScrollLeft}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors opacity-80 hover:opacity-100"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>

                    <button
                      onClick={handleManualScrollRight}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors opacity-80 hover:opacity-100"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>

                    <div
                      ref={scrollContainerRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-8"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      {otherItems.map(item => {
                        const discountInfo = calculateOtherItemDiscount(item);

                        return (
                          <div
                            key={item.id}
                            className="flex-shrink-0 w-40 bg-gray-50 rounded-lg overflow-hidden flex flex-col h-80"
                          >
                            <div className="relative w-full h-32 flex-shrink-0">
                              <FallbackImage
                                src={item.image}
                                fallbackSrc="/food-fallback.png"
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="p-3 flex flex-col flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                {item.name}
                              </h4>

                              {/* Rating */}
                              <div className="flex items-center space-x-1 mb-2">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <svg
                                      key={index}
                                      className={`w-3 h-3 ${
                                        index < Math.floor(item.rating)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {item.rating}
                                </span>
                              </div>

                              {/* Price */}
                              <div className="mb-3 flex-1">
                                <div className="flex items-center space-x-1 mb-1">
                                  <span className="text-sm font-bold text-gray-900">
                                    ₹
                                    {convertThousandSeparator(
                                      item.discount_price || item.price,
                                      0
                                    )}
                                  </span>
                                  {discountInfo.hasDiscount && (
                                    <span className="text-xs text-gray-500 line-through">
                                      ₹
                                      {convertThousandSeparator(
                                        discountInfo.originalPrice,
                                        0
                                      )}
                                    </span>
                                  )}
                                </div>
                                {discountInfo.hasDiscount && (
                                  <span className="text-xs text-red-500 bg-red-50 px-1 py-0.5 rounded">
                                    {discountInfo.discountLabel}
                                  </span>
                                )}
                              </div>

                              <button
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-xs font-medium transition-colors mt-auto"
                                onClick={() => {
                                  // Add to cart functionality
                                  const cartItem = {
                                    id: item.id,
                                    name: item.name,
                                    price: item.discount_price || item.price,
                                    image: item.image,
                                    quantity: 1,
                                    merchant_id: item.merchant_id,
                                    type: item.type as
                                      | 'percentage'
                                      | 'fixed'
                                      | undefined,
                                    discount_percent:
                                      item.discount_percent || undefined,
                                    discount_amount: item.discount_amount
                                      ? item.discount_amount.toString()
                                      : undefined,
                                    discount_price:
                                      item.discount_price || undefined,
                                    customization: {
                                      size: item.size,
                                      color: item.color_name,
                                      sku: item.sku,
                                    },
                                  };
                                  addItem(cartItem);
                                  toast.success(`${item.name} added to cart!`);
                                }}
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Auto-scroll indicator */}
                    {isAutoScrolling && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                        <div className="flex items-center space-x-1 bg-black/20 rounded-full px-2 py-1">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs text-white">
                            Auto-scrolling
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ₹{formattedTotalPrice}
            </span>
            <span className="text-xs text-gray-500">
              {totalItems} {t(totalItems === 1 ? 'cart.item' : 'cart.items')}
            </span>
          </div>
          <button className="text-sm text-red-500 font-medium">
            {t('cart.viewDetails')}
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-full transition-colors"
          aria-label={t('cart.proceedToCheckout')}
        >
          {t('cart.addToCart')}
        </button>
      </div>
    </div>
  );
}

export default Cart;
