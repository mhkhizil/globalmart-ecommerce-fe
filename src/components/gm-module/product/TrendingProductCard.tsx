import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Product } from '@/core/entity/Product';
import { useConvertedPrice } from '@/lib/hooks/store/useConvertedPrice';
import { RootState } from '@/lib/redux/ReduxStore';
import { Locale } from '@/lib/redux/slices/LanguageSlice';

// Function to get description based on current locale
const getLocalizedDescription = (product: Product, locale: Locale): string => {
  switch (locale) {
    case 'en': {
      return product.en_description || '';
    }
    case 'cn': {
      return product.cn_description || product.en_description || '';
    }
    case 'mm': {
      return product.mm_description || product.en_description || '';
    }
    case 'th': {
      return product.th_description || product.en_description || '';
    }
    default: {
      return product.en_description || '';
    }
  }
};

type TrendingProductCardProps = {
  product: Product;
  index?: number;
  heightVariant?: 'short' | 'tall';
};

const TrendingProductCard: React.FC<TrendingProductCardProps> = ({
  product,
  index = 0,
  heightVariant = 'tall',
}) => {
  const router = useRouter();
  const variant = product.first_product_detail;

  // Get current locale from Redux store
  const currentLocale = useSelector(
    (state: RootState) => state.language.locale
  );

  // Check if there's a discount with proper existence and null/undefined handling
  const hasDiscount =
    variant?.discount_type &&
    variant?.discount_type !== null &&
    (variant?.discount_type === 'percentage'
      ? variant?.discount_percent !== null &&
        variant?.discount_percent !== undefined &&
        Number(variant?.discount_percent) > 0
      : variant?.discount_amount !== null &&
        variant?.discount_amount !== undefined &&
        Number(variant?.discount_amount) > 0);

  // Calculate the discounted price with safe property access
  const discountedPrice =
    hasDiscount && variant?.discount_type
      ? variant?.discount_type === 'percentage'
        ? Math.max(
            0,
            Math.round(
              Number(variant.price) -
                Number(variant.price) *
                  (Number(variant?.discount_percent || 0) / 100)
            )
          )
        : Math.max(
            0,
            Math.round(
              Number(variant.price) - Number(variant?.discount_amount || 0)
            )
          )
      : Number(variant.price);

  // Use the currency conversion hook to get converted price
  const { formattedPrice, isConverted, currencyInfo } =
    useConvertedPrice(discountedPrice);

  // Generate star rating elements with inline SVG for better visibility
  const renderRating = useMemo(() => {
    const stars = [];
    const rating = 4.5; // Default rating since it's not in the entity
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add filled stars
    for (let index = 0; index < fullStars; index++) {
      stars.push(
        <svg
          key={`star-filled-${index}`}
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M5.99999 9.16198L9.70798 11.4L8.72398 7.18199L12 4.34399L7.68599 3.97799L5.99999 0L4.31399 3.97799L0 4.34399L3.27599 7.18199L2.292 11.4L5.99999 9.16198Z"
            fill="#EDB310"
          />
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg
          key="star-half"
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M12 4.34399L7.68599 3.97199L5.99999 0L4.31399 3.97799L0 4.34399L3.27599 7.18199L2.292 11.4L5.99999 9.16198L9.70798 11.4L8.72998 7.18199L12 4.34399ZM5.99999 8.03999V2.46L7.02599 4.88399L9.65398 5.11199L7.66199 6.83999L8.26199 9.40798L5.99999 8.03999Z"
            fill="#BBBBBB"
          />
        </svg>
      );
    }

    // Add empty stars
    const totalStarsShown = fullStars + (hasHalfStar ? 1 : 0);
    for (let index = totalStarsShown; index < 5; index++) {
      stars.push(
        <svg
          key={`star-empty-${index}`}
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M5.99999 9.16198L9.70798 11.4L8.72398 7.18199L12 4.34399L7.68599 3.97799L5.99999 0L4.31399 3.97799L0 4.34399L3.27599 7.18199L2.292 11.4L5.99999 9.16198Z"
            fill="#BBBBBB"
          />
        </svg>
      );
    }

    return stars;
  }, []);

  // Get product image with priority: main product image, variant main image, variant detail images
  const productImage =
    product.p_image ||
    variant.p_image ||
    (variant.product_detail_image && variant.product_detail_image.length > 0
      ? variant.product_detail_image[0].image_path
      : '');

  // Animation variants for framer motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut' as const,
      },
    },
    hover: {
      y: -4,
      transition: {
        duration: 0.2,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Define heights - keep content area consistent, only vary image height
  const contentHeight = 120; // Fixed content area height for both variants
  const imageHeight = heightVariant === 'short' ? 160 : 220; // Only image height changes
  const cardHeight = imageHeight + contentHeight; // Total card height

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full bg-white rounded-[8px] overflow-hidden cursor-pointer flex flex-col"
      style={{
        boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
        height: `${cardHeight}px`,
      }}
      onClick={() => {
        router.push(`/application/product/detail/${product.id}`);
      }}
    >
      {/* Product Image */}
      <div
        className="relative w-full overflow-hidden rounded-[8px] flex-shrink-0 border-[1px]"
        style={{ height: `${imageHeight}px` }}
      >
        <Image
          src={productImage}
          alt={product.product_name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 164px, 164px"
          priority={index < 4} // Prioritize first 4 images
        />
      </div>

      {/* Product Details - Fixed height for consistent content area */}
      <div
        className="px-2 pt-2 pb-2 flex flex-col"
        style={{ height: `${contentHeight}px` }}
      >
        {/* Top content */}
        <div className="flex-1 min-h-0">
          {/* Title */}
          <h3
            className="text-black font-['Montserrat'] font-medium text-base leading-[1.25em] mb-1 line-clamp-1"
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            {product.product_name}
          </h3>

          {/* Description - Localized based on selected language */}
          <p
            className="text-black font-['Montserrat'] font-normal leading-[1.6em] mb-2 line-clamp-2"
            style={{ fontSize: '10px', fontWeight: 400 }}
          >
            {getLocalizedDescription(product, currentLocale)}
          </p>

          {/* Price */}
          <div className="mb-2">
            <span
              className="text-black font-['Montserrat'] font-medium leading-[1.3333333333333333em]"
              style={{ fontSize: '12px', fontWeight: 500 }}
              title={
                isConverted
                  ? `Converted from ${discountedPrice} MMK`
                  : undefined
              }
            >
              {formattedPrice}
            </span>
            {/* Show conversion indicator if price was converted */}
            {isConverted && (
              <span
                className="ml-1 text-gray-500 font-['Montserrat'] font-normal"
                style={{ fontSize: '10px' }}
              >
                {currencyInfo.flag}
              </span>
            )}
          </div>
        </div>

        {/* Bottom content - Rating and Review Count - Always visible */}
        <div className="flex items-center justify-between mt-auto flex-shrink-0">
          {/* Stars */}
          <div className="flex items-center gap-0">{renderRating}</div>

          {/* Review Count */}
          <span
            className="font-['Montserrat'] font-normal leading-[1.6em] text-right"
            style={{
              fontSize: '10px',
              fontWeight: 400,
              color: '#A4A9B3',
            }}
          >
            {Math.floor(Math.random() * 10_000).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingProductCard;
