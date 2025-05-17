'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProductDetail } from '@/core/entity/Product';
import { RootState } from '@/lib/redux/ReduxStore';
import { addItem } from '@/lib/redux/slices/CartSlice';

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

interface ProductDetailProps {
  product: ProductDetail;
}

function ProductDetailInfo({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('7UK');
  const [quantity, setQuantity] = useState<number>(1);
  const [showCartOptions, setShowCartOptions] = useState<boolean>(false);
  const { locale } = useSelector((state: RootState) => state.language);
  const dispatch = useDispatch();
  const cartOptionsRef = useRef<HTMLDivElement>(null);
  console.log(product);
  const sizes = ['6 UK', '7 UK', '8 UK', '9 UK', '10 UK'];

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

  // Calculate discount price
  const calculateDiscountedPrice = () => {
    if (product.discount_type === 'percentage' && product.discount_percent) {
      return (
        product.p_price - (product.p_price * product.discount_percent) / 100
      );
    } else if (product.discount_type === 'fixed' && product.discount_amount) {
      return product.p_price - Number.parseFloat(product.discount_amount);
    }
    return product.p_price;
  };

  const discountedPrice = calculateDiscountedPrice();
  const discountPercentage =
    product.discount_type === 'percentage'
      ? product.discount_percent
      : Math.round(
          (Number.parseFloat(product.discount_amount) / product.p_price) * 100
        );

  const handleIncreaseQuantity = () => {
    if (quantity < product.p_stock) {
      setQuantity(previous => previous + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(previous => previous - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.p_name,
        price: product.p_price,
        quantity: quantity,
        merchant_id: product.m_id,
        type: product.discount_type,
        discount_percent: product.discount_percent,
        discount_amount: product.discount_amount,
        discount_price: discountedPrice,
        image: product.p_image,
        customization: { size: selectedSize },
      })
    );
    setShowCartOptions(false);
  };

  const handleBuyNow = () => {
    setShowCartOptions(true);
  };

  return (
    <div className="flex flex-col px-4">
      <div className="relative w-full">
        <ProductImageSlider
          images={product.product_image}
          productName={product.p_name}
          fallbackImage={product.p_image}
        />
      </div>
      <div className="mt-1 ">
        <div className="mb-2">
          <h3 className="text-[14px] font-['Montserrat'] font-bold">
            Size: {selectedSize}
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size.replace(' ', ''))}
              className={`
                min-w-[4.3rem] py-2 px-4 rounded-md font-semibold text-sm
                ${
                  selectedSize === size.replace(' ', '')
                    ? 'bg-[#FA7189] text-white'
                    : 'bg-white text-[#FA7189] border border-[#FA7189]'
                }
                transition-colors duration-200
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-xl font-[600] text-black font-['Montserrat']">
          {product.p_name}
        </h1>
        <p className="text-sm text-gray-600 mt-1 font-['Montserrat']">
          {product.c_name}
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
          <span className="ml-2 text-[#828282] text-sm font-['Montserrat']">
            56,890
          </span>
        </div>

        <div className="mt-3 flex items-center">
          <span className="text-[#808488] line-through text-sm font-['Montserrat']">
            ₹{product.p_price.toLocaleString()}
          </span>
          <span className="ml-2 text-sm font-[500] font-['Montserrat']">
            ₹{discountedPrice.toLocaleString()}
          </span>
          <span className="ml-2 text-[#FA7189] text-sm font-['Montserrat']">
            {discountPercentage}% Off
          </span>
        </div>

        <div className="mt-2">
          <h2 className="text-sm font-[500] font-['Montserrat']">
            Product Details
          </h2>
          <p className="mt-2 text-gray-700 text-[0.75rem] font-['Montserrat']">
            {getLocaleDescription()}
          </p>
        </div>

        <div className="mt-4 flex space-x-2">
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
        </div>
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
                    disabled={quantity >= product.p_stock}
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
                {quantity >= product.p_stock && (
                  <p className="text-red-500 text-xs mt-1">
                    Maximum stock reached
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
                  className="flex-1 py-2 px-4 bg-gradient-to-b from-[#3F92FF] to-[#0B3689] text-white rounded-md font-['Montserrat']"
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
              <Link href="/application/cart" className="w-[136px]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex w-full h-9 bg-gradient-to-b from-[#3F92FF] to-[#0B3689] rounded-l-[20px] rounded-r-[4px] items-center justify-center"
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

                  <span className="text-white font-['Montserrat'] font-medium text-sm truncate pl-6">
                    Go to cart
                  </span>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-[136px] flex  h-9 bg-gradient-to-b from-[#71F9A9] to-[#31B769] rounded-l-[20px] rounded-r-[4px] items-center justify-center cursor-pointer"
                onClick={handleBuyNow}
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
    </div>
  );
}
export default ProductDetailInfo;
