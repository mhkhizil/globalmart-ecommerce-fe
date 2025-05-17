'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ProductDetail } from '@/core/entity/Product';
import { RootState } from '@/lib/redux/ReduxStore';

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
  const { locale } = useSelector((state: RootState) => state.language);
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

      <div>{/*others*/}</div>
    </div>
  );
}
export default ProductDetailInfo;
