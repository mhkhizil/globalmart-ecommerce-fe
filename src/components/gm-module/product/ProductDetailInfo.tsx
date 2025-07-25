'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { MainProductDetail, ProductDetail } from '@/core/entity/Product';
import { useConvertedPrice } from '@/lib/hooks/store/useConvertedPrice';
import { RootState } from '@/lib/redux/ReduxStore';
import {
  addItem,
  addItemWithMerchantCheck,
} from '@/lib/redux/slices/CartSlice';

import ProductAction from './ProductAction';
import ProductImageSlider from './ProductImageSlider';

// Custom SVG components to match Figma designs
const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clipPath="url(#clip0_1_7477)">
      <path
        d="M8.00004 2.66671C9.28671 2.66671 11.3334 3.60004 11.3334 6.10004C11.3334 7.54004 10.1867 9.21337 8.00004 10.98C5.81337 9.21337 4.66671 7.53337 4.66671 6.10004C4.66671 3.60004 6.71337 2.66671 8.00004 2.66671ZM8.00004 1.33337C5.82004 1.33337 3.33337 2.97337 3.33337 6.10004C3.33337 8.18004 4.88671 10.3734 8.00004 12.6667C11.1134 10.3734 12.6667 8.18004 12.6667 6.10004C12.6667 2.97337 10.18 1.33337 8.00004 1.33337Z"
        fill="#828282"
      />
      <path
        d="M8.00004 4.66663C7.26671 4.66663 6.66671 5.26663 6.66671 5.99996C6.66671 6.73329 7.26671 7.33329 8.00004 7.33329C8.35366 7.33329 8.6928 7.19282 8.94285 6.94277C9.1929 6.69272 9.33337 6.35358 9.33337 5.99996C9.33337 5.64634 9.1929 5.3072 8.94285 5.05715C8.6928 4.8071 8.35366 4.66663 8.00004 4.66663ZM3.33337 13.3333H12.6667V14.6666H3.33337V13.3333Z"
        fill="#828282"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_7477">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <rect width="32" height="32" rx="16" fill="#F2F2F2" />
    <g clipPath="url(#clip0_126_7)">
      <path
        d="M12.8334 21C11.9167 21 11.175 21.75 11.175 22.6666C11.175 23.5833 11.9167 24.3333 12.8334 24.3333C13.75 24.3333 14.5 23.5833 14.5 22.6666C14.5 21.75 13.75 21 12.8334 21ZM21.1667 21C20.25 21 19.5084 21.75 19.5084 22.6666C19.5084 23.5833 20.25 24.3333 21.1667 24.3333C22.0834 24.3333 22.8334 23.5833 22.8334 22.6666C22.8334 21.75 22.0834 21 21.1667 21ZM19.9584 16.8333C20.5834 16.8333 21.1334 16.4916 21.4167 15.975L24.4 10.5666C24.7084 10.0166 24.3084 9.33329 23.675 9.33329H11.3417L10.5584 7.66663H7.83337V9.33329H9.50004L12.5 15.6583L11.375 17.6916C10.7667 18.8083 11.5667 20.1666 12.8334 20.1666H22.8334V18.5H12.8334L13.75 16.8333H19.9584ZM12.1334 11H22.2584L19.9584 15.1666H14.1084L12.1334 11Z"
        fill="#323232"
      />
    </g>
    <defs>
      <clipPath id="clip0_126_7">
        <rect width="20" height="20" fill="white" transform="translate(7 6)" />
      </clipPath>
    </defs>
  </svg>
);

const MemoizedProductAction = memo(ProductAction);

interface ProductDetailProps {
  product: MainProductDetail;
}

function ProductDetailInfo({ product }: ProductDetailProps) {
  const router = useRouter();
  // Initialize with the first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductDetail>(
    product.product_detail[0] || null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showCartOptions, setShowCartOptions] = useState<boolean>(false);
  const [showMerchantConflictDialog, setShowMerchantConflictDialog] =
    useState<boolean>(false);
  const { locale } = useSelector((state: RootState) => state.language);
  const cartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const cartOptionsRef = useRef<HTMLDivElement>(null);

  // Get current user's cart items
  const currentUserId = cartState.currentUserId || 'guest';
  const currentCartItems = cartState.carts[currentUserId]?.items || [];

  // Get unique variants (colors) for selection
  const availableVariants = product.product_detail || [];

  // Get the description based on current locale
  const getLocaleDescription = () => {
    switch (locale) {
      case 'en': {
        return product.en_description;
      }
      case 'mm': {
        return product.mm_description || product.en_description;
      }
      case 'th': {
        return product.th_description || product.en_description;
      }
      case 'cn': {
        return product.cn_description || product.en_description;
      }
      default: {
        return product.en_description;
      }
    }
  };

  // Calculate discount price using selected variant
  const calculateDiscountedPrice = () => {
    if (!selectedVariant) return 0;

    if (
      selectedVariant?.discount_type === 'percentage' &&
      selectedVariant?.discount_percent !== null &&
      selectedVariant?.discount_percent !== undefined
    ) {
      return Math.max(
        0,
        Number(selectedVariant.price) -
          (Number(selectedVariant.price) *
            Number(selectedVariant?.discount_percent)) /
            100
      );
    } else if (
      selectedVariant?.discount_type === 'fixed' &&
      selectedVariant?.discount_amount !== null &&
      selectedVariant?.discount_amount !== undefined
    ) {
      return Math.max(
        0,
        Number(selectedVariant.price) - Number(selectedVariant?.discount_amount)
      );
    }
    return Number(selectedVariant.price);
  };

  const discountedPrice = calculateDiscountedPrice();
  const discountPercentage = selectedVariant
    ? selectedVariant?.discount_type === 'percentage' &&
      selectedVariant?.discount_percent !== null &&
      selectedVariant?.discount_percent !== undefined
      ? Number(selectedVariant?.discount_percent)
      : selectedVariant?.discount_type === 'fixed' &&
          selectedVariant?.discount_amount !== null &&
          selectedVariant?.discount_amount !== undefined &&
          Number(selectedVariant.price) > 0
        ? Math.round(
            (Number(selectedVariant?.discount_amount) /
              Number(selectedVariant.price)) *
              100
          )
        : 0
    : 0;

  // Use the currency conversion hooks for both discounted and original prices
  const { formattedPrice, isConverted, currencyInfo } =
    useConvertedPrice(discountedPrice);
  const originalPriceConverted = useConvertedPrice(
    Number(selectedVariant?.price || 0)
  );

  const handleIncreaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(previous => previous + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(previous => previous - 1);
    }
  };

  const handleGoToCart = () => {
    router.push('/application/shopping-bag');
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    // Check if there are items from a different merchant in the cart
    const hasDifferentMerchant =
      currentCartItems.length > 0 &&
      currentCartItems[0].merchant_id !== product.merchant_id;

    if (hasDifferentMerchant) {
      setShowMerchantConflictDialog(true);
      return;
    }

    // Add item normally if no conflict
    addItemToCart();
  };

  const addItemToCart = () => {
    if (!selectedVariant) return;

    dispatch(
      addItem({
        id: selectedVariant.id,
        name: product.product_name,
        price: Number(selectedVariant.price),
        quantity: quantity,
        merchant_id: product.merchant_id,
        type: selectedVariant?.discount_type || undefined,
        discount_percent: selectedVariant?.discount_percent
          ? Number(selectedVariant.discount_percent)
          : undefined,
        discount_amount: selectedVariant?.discount_amount || undefined,
        discount_price: discountedPrice,
        image: selectedVariant.p_image || product.p_image,
        customization: {
          color: selectedVariant.color_name,
          size: selectedVariant.size,
        },
      })
    );
    console.log('Product name:', product.product_name);
    console.log('Variant product name:', selectedVariant.product_name);

    setShowCartOptions(false);
    toast.success('Item added to cart');
  };

  const handleConfirmReplaceCart = () => {
    if (!selectedVariant) return;

    dispatch(
      addItemWithMerchantCheck({
        item: {
          id: selectedVariant.id,
          name: product.product_name,
          price: Number(selectedVariant.price),
          quantity: quantity,
          merchant_id: product.merchant_id,
          type: selectedVariant?.discount_type || undefined,
          discount_percent: selectedVariant?.discount_percent
            ? Number(selectedVariant.discount_percent)
            : undefined,
          discount_amount: selectedVariant?.discount_amount || undefined,
          discount_price: discountedPrice,
          image: selectedVariant.p_image || product.p_image,
          customization: {
            color: selectedVariant.color_name,
            size: selectedVariant.size,
          },
        },
        replaceCart: true,
      })
    );
    setShowCartOptions(false);
    setShowMerchantConflictDialog(false);
    toast.success('Cart replaced with new item');
    router.push('/application/cart');
  };

  const handleCancelReplaceCart = () => {
    setShowMerchantConflictDialog(false);
  };

  const handleBuyNow = () => {
    setShowCartOptions(true);
  };

  // const handleViewSimilar = () => {
  //   console.log('View similar products');
  // };

  // const handleReviews = () => {
  //   console.log('View reviews');
  // };

  // Handle variant selection
  const handleVariantSelect = (variant: ProductDetail) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };
  console.log(selectedVariant);

  if (!selectedVariant) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No variants available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4">
      <Toaster position="top-center" />
      <div className="flex w-full justify-between items-center py-4">
        <ChevronLeftIcon className="cursor-pointer" />
        <div className="cursor-pointer">
          <CartIcon />
        </div>
      </div>
      <div className="relative w-full">
        <ProductImageSlider
          images={selectedVariant.product_detail_image}
          productName={product.product_name}
          fallbackImage={selectedVariant.p_image || product.p_image}
        />
      </div>

      {/* Color/Variant Selection */}
      <div className="mt-4 ">
        <div className="mb-3">
          <h3 className="text-[14px] font-['Montserrat'] font-bold mb-2">
            Color: {selectedVariant.color_name}
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableVariants.map(variant => (
              <motion.button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative min-w-[3rem] h-12 rounded-md border-2 transition-all duration-200
                  ${
                    selectedVariant.id === variant.id
                      ? 'border-[#FA7189] shadow-md'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                style={{
                  backgroundColor: '#' + variant.color_code || '#f3f4f6',
                }}
                aria-label={`Select ${variant.color_name}`}
              >
                {selectedVariant.id === variant.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#FA7189]"></div>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Size Display */}
        <div className="mb-2">
          <h3 className="text-[14px] font-['Montserrat'] font-medium text-gray-600">
            Size: {selectedVariant.size}
          </h3>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-xl font-[600] text-black font-['Montserrat']">
          {product.product_name}
        </h1>
        <p className="text-sm text-gray-600 mt-1 font-['Montserrat']">
          {product.category_name} • {selectedVariant.color_name}
        </p>

        <div className="flex items-center mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {/* <span className="ml-2 text-[#828282] text-sm font-['Montserrat']">
            56,890
          </span> */}
        </div>

        <div className="mt-3 flex items-center">{product.shop_name}</div>

        <div className="mt-3 flex items-center">
          {discountPercentage > 0 ? (
            <>
              <span
                className="text-[#808488] line-through text-sm font-['Montserrat']"
                title={
                  isConverted
                    ? `Converted from ${Number(selectedVariant.price)} MMK`
                    : undefined
                }
              >
                {originalPriceConverted.formattedPrice}
              </span>
              {/* Show conversion indicator for original price if converted */}
              {isConverted && (
                <span className="ml-1 text-gray-500 text-xs">
                  {currencyInfo.flag}
                </span>
              )}
              <span
                className="ml-2 text-sm font-[500] font-['Montserrat']"
                title={
                  isConverted
                    ? `Converted from ${discountedPrice} MMK`
                    : undefined
                }
              >
                {formattedPrice}
              </span>
              {/* Show conversion indicator for discounted price if converted */}
              {isConverted && (
                <span className="ml-1 text-gray-500 text-xs">
                  {currencyInfo.flag}
                </span>
              )}
              <span className="ml-2 text-[#FA7189] text-sm font-['Montserrat']">
                {discountPercentage}% Off
              </span>
            </>
          ) : (
            <>
              <span
                className="text-sm font-[500] font-['Montserrat']"
                title={
                  isConverted
                    ? `Converted from ${Number(selectedVariant.price)} MMK`
                    : undefined
                }
              >
                {formattedPrice}
              </span>
              {/* Show conversion indicator if price was converted */}
              {isConverted && (
                <span className="ml-1 text-gray-500 text-xs">
                  {currencyInfo.flag}
                </span>
              )}
            </>
          )}
        </div>

        {/* Stock Information */}
        <div className="mt-2">
          <span
            className={`text-xs font-['Montserrat'] ${
              selectedVariant.stock > 10
                ? 'text-green-600'
                : selectedVariant.stock > 0
                  ? 'text-orange-600'
                  : 'text-red-600'
            }`}
          >
            {selectedVariant.stock > 10
              ? 'In Stock'
              : selectedVariant.stock > 0
                ? `Only ${selectedVariant.stock} left`
                : 'Out of Stock'}
          </span>
        </div>

        <div className="mt-3">
          <h2 className="text-sm font-[500] font-['Montserrat']">
            Product Details
          </h2>
          <p className="mt-2 text-gray-700 text-[0.75rem] font-['Montserrat']">
            {getLocaleDescription()}
          </p>
        </div>

        {/* <div className="mt-4 flex space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 py-2 px-4 rounded border border-gray-300"
          >
            <StoreIcon />
            <span className="text-[10px] font-medium text-gray-500">
              Nearest Store
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 py-2 px-4 rounded border border-gray-300"
          >
            <Image src="/icons/vip-icon.svg" alt="VIP" width={12} height={12} />
            <span className="text-[10px] font-medium text-gray-500">VIP</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 py-2 px-4 rounded border border-gray-300"
          >
            <Image
              src="/icons/return-icon.svg"
              alt="Return"
              width={12}
              height={12}
            />
            <span className="text-[10px] font-medium text-gray-500">
              Return policy
            </span>
          </motion.button>
        </div> */}
      </div>

      <div className="mt-8 mb-4 relative">
        <AnimatePresence>
          {showCartOptions ? (
            <motion.div
              ref={cartOptionsRef}
              className="bg-white p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium font-['Montserrat'] mb-2">
                  Add to Cart
                </h3>
                <div className="flex items-center border border-gray-200 rounded-md p-1 w-fit">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33331 8H12.6666"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <span className="w-10 text-center font-['Montserrat']">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800"
                    disabled={
                      quantity >= selectedVariant.stock ||
                      selectedVariant.stock === 0
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3.33337V12.6667M3.33337 8.00004H12.6667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                {quantity >= selectedVariant.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    Maximum stock reached
                  </p>
                )}
                {selectedVariant.stock === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    This variant is out of stock
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCartOptions(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-['Montserrat'] text-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock === 0}
                  className="flex-1 py-2 px-4 bg-gradient-to-b from-[#3F92FF] to-[#0B3689] text-white rounded-md font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex gap-2 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoToCart}
                className="relative flex w-[136px] h-9 bg-gradient-to-b from-[#3F92FF] to-[#0B3689] rounded-l-[20px] rounded-r-[4px] items-center justify-center cursor-pointer"
              >
                <div className="absolute left-0 w-10 h-10 flex items-center justify-center">
                  <div className="h-full w-full rounded-full bg-gradient-to-b from-[#3F92FF] to-[#0B3689] flex items-center justify-center shadow-[inset_0px_4px_4px_rgba(0,0,0,0.15),inset_0px_-4px_4px_rgba(0,0,0,0.15)]">
                    <Image
                      src="/icons/cart-icon-fill.svg"
                      alt="Cart"
                      width={14}
                      height={14}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
                <span className="text-xs font-['Montserrat'] text-white ml-6">
                  Go to Cart
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-[136px] flex h-9 bg-gradient-to-b from-[#71F9A9] to-[#31B769] rounded-l-[20px] rounded-r-[4px] items-center justify-center cursor-pointer"
                onClick={handleBuyNow}
                style={{
                  opacity: selectedVariant.stock === 0 ? 0.5 : 1,
                  pointerEvents: selectedVariant.stock === 0 ? 'none' : 'auto',
                }}
              >
                <div className="absolute left-0 w-10 h-10 flex items-center justify-center">
                  <div className="h-full w-full rounded-full bg-gradient-to-b from-[#71F9A9] to-[#31B769] flex items-center justify-center shadow-[inset_0px_4px_4px_rgba(0,0,0,0.15),inset_0px_-4px_4px_rgba(0,0,0,0.15)]">
                    <Image
                      src="/icons/buy-now-icon.svg"
                      alt="Buy Now"
                      width={14}
                      height={14}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                <span className="text-white font-['Montserrat'] font-medium text-sm truncate pl-6">
                  Buy Now
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <MemoizedProductAction
          // onViewSimilar={handleViewSimilar}
          // onReviews={handleReviews}
          categoryId={product.category_id}
        />
      </div>

      {/* Merchant Conflict Confirmation Dialog */}
      <AnimatePresence>
        {showMerchantConflictDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold font-['Montserrat'] mb-3">
                Different Merchant
              </h3>
              <p className="text-gray-600 font-['Montserrat'] mb-4">
                Your cart contains items from a different merchant. Adding this
                item will replace your current cart. Do you want to continue?
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelReplaceCart}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-['Montserrat'] text-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmReplaceCart}
                  className="flex-1 py-2 px-4 bg-gradient-to-b from-[#FA7189] to-[#E91E63] text-white rounded-md font-['Montserrat']"
                >
                  Replace Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductDetailInfo;
