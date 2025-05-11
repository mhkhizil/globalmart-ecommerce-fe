'use client';

import clsx from 'clsx';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useMemo, useState } from 'react';

import StarIcon from '@/components/common/icons/StarIcon';
import { ProductDetail } from '@/core/entity/Product';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

// Types
type MotionProductCardProps = HTMLMotionProps<'div'> & {
  product: ProductDetail;
};

// Constants
const IMAGE_FALLBACK_SRC = '/food-fallback.png';
const IMAGE_SIZES = '(max-width: 768px) 33vw, 25vw';
const IMAGE_DIMENSIONS = { width: 512, height: 512 } as const;

// Animation variants
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const shimmerAnimation = {
  hidden: { backgroundPosition: '200% 0' },
  visible: {
    backgroundPosition: '-200% 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  },
};

// Main Component
const ProductPreviewCard = memo(
  ({ product, className, ...rest }: MotionProductCardProps) => {
    const t = useTranslations();
    const router = useRouter();
    const [imageSource, setImageSource] = useState(
      product.p_image || IMAGE_FALLBACK_SRC
    );
    const [imageLoaded, setImageLoaded] = useState(false);

    // Safe product data with fallbacks
    const safeProduct = useMemo(
      () => ({
        id: product.id || 'unknown',
        p_name: product.p_name || t('product.unnamedProduct'),
        p_price: product.p_price || 0,
        p_stock: product.p_stock ?? 0,
        shop_name: product.shop_name || t('product.unknownRestaurant'),
        discount_type: product.discount_type,
        discount_percent: product.discount_percent,
        discount_amount: product.discount_amount,
      }),
      [product, t]
    );

    // Calculate discounted price and discount display information
    const {
      hasDiscount,
      discountedPrice,
      discountLabel,
      savingsAmount,
      percentOff,
    } = useMemo(() => {
      const hasDiscount =
        safeProduct.discount_type &&
        (safeProduct.discount_percent || safeProduct.discount_amount);

      if (!hasDiscount) {
        return {
          hasDiscount: false,
          discountedPrice: safeProduct.p_price,
          discountLabel: undefined,
          savingsAmount: 0,
          percentOff: 0,
        };
      }

      let discountedPrice = safeProduct.p_price;
      let discountLabel = 'SALE';

      // Calculate discounted price
      if (
        safeProduct.discount_type === 'percentage' &&
        safeProduct.discount_percent
      ) {
        // Percentage discount
        discountedPrice =
          safeProduct.p_price * (1 - safeProduct.discount_percent / 100);
        discountLabel = `${safeProduct.discount_percent}% OFF`;
      } else if (
        safeProduct.discount_type === 'fixed' &&
        safeProduct.discount_amount
      ) {
        // Fixed amount discount
        const amountValue = Number.parseFloat(safeProduct.discount_amount);
        discountedPrice = Math.max(0, safeProduct.p_price - amountValue);
        discountLabel = `$${convertThousandSeparator(amountValue, 1)} OFF`;
      }

      // Ensure we round to 2 decimal places for display
      discountedPrice = Number(discountedPrice.toFixed(2));

      // Calculate savings
      const savingsAmount = Number(
        (safeProduct.p_price - discountedPrice).toFixed(2)
      );

      // Calculate percent off
      const percentOff = Math.round(
        (savingsAmount / safeProduct.p_price) * 100
      );

      return {
        hasDiscount,
        discountedPrice,
        discountLabel,
        savingsAmount,
        percentOff,
      };
    }, [safeProduct]);

    // For debugging in development
    // console.log('Discount info:', {
    //   originalPrice: safeProduct.p_price,
    //   discountedPrice,
    //   discountType: safeProduct.discount_type,
    //   discountPercent: safeProduct.discount_percent,
    //   discountAmount: safeProduct.discount_amount,
    //   savingsAmount,
    //   percentOff,
    //   hasDiscount,
    // });

    // Handlers
    const handleClick = useCallback(() => {
      router.push(`/application/product/detail/${safeProduct.id}`);
    }, [router, safeProduct.id]);

    const handleImageError = useCallback(() => {
      setImageSource(IMAGE_FALLBACK_SRC);
    }, []);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    // Handle keyboard event for motion component
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <motion.div
        className={clsx(
          'w-full overflow-hidden rounded-xl bg-white cursor-pointer relative',
          hasDiscount
            ? 'shadow-md ring-1 ring-orange-200'
            : 'shadow border border-gray-100',
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={t('product.viewDetailsFor', { name: safeProduct.p_name })}
        {...rest}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute right-0 top-4 z-20">
            <div className="flex items-center">
              <div className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold shadow-sm rounded-l-md">
                {discountLabel}
              </div>
              <div
                className="w-0 h-0 border-t-[13px] border-b-[13px] border-l-[10px] border-transparent border-l-red-600"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        )}

        <div className="flex p-3.5 gap-4">
          {/* Image with shimmer effect while loading */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <AnimatePresence>
              {!imageLoaded && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
                  variants={shimmerAnimation}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <Image
              src={imageSource}
              alt={safeProduct.p_name}
              width={IMAGE_DIMENSIONS.width}
              height={IMAGE_DIMENSIONS.height}
              sizes={IMAGE_SIZES}
              className={clsx(
                'w-full h-full object-cover rounded-lg transition-opacity duration-200',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              priority={false}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow justify-between min-w-0">
            {/* Top section: Name & Restaurant */}
            <div className="space-y-1">
              <h3 className="text-gray-900 font-medium text-base leading-5 truncate">
                {safeProduct.p_name}
              </h3>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <span className="truncate">{safeProduct.shop_name}</span>
              </div>
            </div>

            {/* Bottom section: Price, Stock, Discount */}
            <div className="mt-auto pt-1.5">
              {/* Price section */}
              <div className="flex flex-col">
                {/* Price display */}
                <div className="flex items-center gap-2.5">
                  {hasDiscount ? (
                    <>
                      {/* Discounted price */}
                      <span className="text-orange-500 font-bold text-lg leading-6">
                        ${convertThousandSeparator(discountedPrice, 2)}
                      </span>

                      {/* Original price */}
                      <span className="text-gray-400 text-xs line-through mt-0.5">
                        ${convertThousandSeparator(safeProduct.p_price, 2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-orange-500 font-bold text-lg leading-6">
                      ${convertThousandSeparator(safeProduct.p_price, 2)}
                    </span>
                  )}
                </div>

                {/* Savings information */}
                {hasDiscount && savingsAmount > 0 && (
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {/* Savings amount */}
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-sm font-medium">
                        Save ${convertThousandSeparator(savingsAmount, 2)}
                        {percentOff > 0 && ` (${percentOff}% off)`}
                      </span>
                    </div>

                    {/* Discount explanation */}
                    {/* <div className="text-xs text-gray-600 font-normal">
                      {safeProduct.discount_type === 'percentage'
                        ? `${safeProduct.discount_percent}% discount applied`
                        : `$${convertThousandSeparator(parseFloat(safeProduct.discount_amount || '0'), 2)} discount applied`}
                    </div> */}
                  </div>
                )}
              </div>

              {/* Stock indicator */}
              {safeProduct.p_stock <= 5 && safeProduct.p_stock > 0 && (
                <div className="mt-2 text-xs text-amber-600 font-medium">
                  Only {safeProduct.p_stock} left
                </div>
              )}
              {safeProduct.p_stock === 0 && (
                <div className="mt-2 text-xs text-red-600 font-medium">
                  Out of stock
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProductPreviewCard.displayName = 'ProductPreviewCard';
export default ProductPreviewCard;
