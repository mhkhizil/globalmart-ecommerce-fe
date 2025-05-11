'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo, useState } from 'react';

import LikeIcon from '@/components/common/icons/LikeIcon';
import StarIcon from '@/components/common/icons/StarIcon';
import { ProductDetail } from '@/core/entity/Product';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

// Types
interface ProductPreviewCardProps {
  product: ProductDetail;
}

// Constants
const FALLBACK_IMAGE = '/food-fallback.png'; // Primary fallback, ensure it exists in /public
const ULTIMATE_FALLBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAEBgIBScXhRwAAAABJRU5ErkJggg=='; // Inline gray placeholder
const IMAGE_DIMENSIONS = { width: 512, height: 512 } as const;
const DEFAULT_RESTAURANT = 'Restaurant';

// Animation variants
const discountBadgeVariants = {
  initial: { opacity: 0, scale: 0.8, x: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const priceRevealVariants = {
  initial: { opacity: 0, y: 5 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
};

const savingsPulseVariants = {
  initial: { scale: 1, opacity: 0.9 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      repeat: Infinity,
      repeatType: 'mirror' as const,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// New animation variants for out of stock overlay
const outOfStockOverlayVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const outOfStockBadgeVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

const pulseAnimation = {
  initial: { opacity: 0.7 },
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// Component
const ProductPreviewCard2 = memo(({ product }: ProductPreviewCardProps) => {
  const [liked, setLiked] = useState(false);
  const [imageSource, setImageSource] = useState(
    product.p_image || FALLBACK_IMAGE
  );
  const [hasImageFailed, setHasImageFailed] = useState(false); // Track ultimate failure
  const router = useRouter();

  // Safe product data with fallbacks
  const safeProduct = useMemo(
    () => ({
      id: product.id || 'unknown',
      p_name: product.p_name || 'Unnamed Product',
      p_image: product.p_image || FALLBACK_IMAGE,
      p_price: product.p_price || 0,
      p_stock: product.p_stock ?? 0,
      c_name: product.c_name ?? 'Unknown Category',
      m_name: product.m_name ?? 'Unknown Merchant',
      shop_name: product.shop_name ?? 'Unknown Shop',
      discount_type: product.discount_type,
      discount_percent: product.discount_percent,
      discount_amount: product.discount_amount,
    }),
    [product]
  );

  // Check if product is out of stock
  const isOutOfStock = useMemo(
    () => safeProduct.p_stock === 0,
    [safeProduct.p_stock]
  );

  // Calculate discount information
  const {
    hasDiscount,
    discountedPrice,
    discountLabel,
    savingsAmount,
    percentOff,
  } = useMemo(() => {
    const originalPrice = safeProduct.p_price || 0;
    const hasDiscount =
      safeProduct.discount_type &&
      (safeProduct.discount_percent || safeProduct.discount_amount);

    if (!hasDiscount) {
      return {
        hasDiscount: false,
        discountedPrice: originalPrice,
        discountLabel: undefined,
        savingsAmount: 0,
        percentOff: 0,
      };
    }

    let discountedPrice = originalPrice;
    let discountLabel = '';

    // Calculate discount based on type
    if (
      safeProduct.discount_type === 'percentage' &&
      safeProduct.discount_percent
    ) {
      // Percentage discount
      discountedPrice =
        originalPrice * (1 - safeProduct.discount_percent / 100);
      discountLabel = `${safeProduct.discount_percent}%`;
    } else if (
      safeProduct.discount_type === 'fixed' &&
      safeProduct.discount_amount
    ) {
      // Fixed amount discount
      const amountValue = Number.parseFloat(safeProduct.discount_amount);
      discountedPrice = Math.max(0, originalPrice - amountValue);
      discountLabel = `$${convertThousandSeparator(amountValue, 1)}`;
    }

    // Ensure proper decimal precision
    discountedPrice = Number(discountedPrice.toFixed(2));

    // Calculate savings
    const savingsAmount = Number((originalPrice - discountedPrice).toFixed(2));
    const percentOff = Math.round((savingsAmount / originalPrice) * 100);

    return {
      hasDiscount,
      discountedPrice,
      discountLabel,
      savingsAmount,
      percentOff,
    };
  }, [safeProduct]);

  // Handlers
  const handleCardClick = useCallback(() => {
    // Prevent navigation if product is out of stock
    if (!isOutOfStock) {
      router.push(`/application/product/detail/${safeProduct.id}`);
    }
  }, [router, safeProduct.id, isOutOfStock]);

  const handleLikeToggle = useCallback(() => {
    setLiked(previous => !previous);
  }, []);

  const handleImageError = useCallback(() => {
    if (imageSource === FALLBACK_IMAGE) {
      // If fallback fails, switch to ultimate inline fallback
      setImageSource(ULTIMATE_FALLBACK);
      setHasImageFailed(true);
    } else {
      // First failure, try the fallback
      setImageSource(FALLBACK_IMAGE);
    }
  }, [imageSource]);

  return (
    <article
      className={`flex w-full flex-col flex-shrink-0 gap-2 p-1 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-200 h-[230px] relative ${hasDiscount ? 'border border-orange-100' : ''} ${isOutOfStock ? 'opacity-90' : ''}`}
      key={safeProduct.id}
    >
      {/* Discount Badge - Top Right Corner */}
      {hasDiscount && !isOutOfStock && (
        <motion.div
          className="absolute -top-2 -right-2 z-20"
          variants={discountBadgeVariants}
          initial="initial"
          animate="animate"
        >
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {discountLabel} OFF
          </div>
        </motion.div>
      )}

      {/* Out of Stock Badge - Top Left Corner */}
      {isOutOfStock && (
        <motion.div
          className="absolute -top-2 -left-2 z-30"
          variants={outOfStockBadgeVariants}
          initial="initial"
          animate="animate"
        >
          <div className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            OUT OF STOCK
          </div>
        </motion.div>
      )}

      {/* Image Section */}
      <div
        className={`relative w-full h-[106px] rounded-lg overflow-hidden ${isOutOfStock ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={isOutOfStock ? undefined : handleCardClick}
        role={isOutOfStock ? undefined : 'button'}
        tabIndex={isOutOfStock ? undefined : 0}
        aria-label={
          isOutOfStock
            ? `${safeProduct.p_name} - Out of stock`
            : `View details for ${safeProduct.p_name}`
        }
        onKeyDown={
          isOutOfStock
            ? undefined
            : event => event.key === 'Enter' && handleCardClick()
        }
      >
        <Image
          src={imageSource}
          alt={safeProduct.p_name}
          width={IMAGE_DIMENSIONS.width}
          height={IMAGE_DIMENSIONS.height}
          className={`absolute inset-0 w-full h-full object-cover rounded-lg ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
          priority={false} // Lazy load by default
          placeholder={hasImageFailed ? 'empty' : 'blur'} // No blur if ultimate fallback
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+/ahAQI8A/8BOz8L9gAAAABJRU5ErkJggg=="
          onError={handleImageError}
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <motion.div
            className="absolute inset-0 bg-gray-800/30 flex items-center justify-center z-10"
            variants={outOfStockOverlayVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-gray-900/80 px-3 py-1.5 rounded-md text-white text-sm font-medium flex items-center gap-1.5"
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Unavailable
            </motion.div>
          </motion.div>
        )}

        {/* Like Button */}
        <button
          onClick={event => {
            event.stopPropagation(); // Prevent card click
            handleLikeToggle();
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white focus:outline-none focus:ring-0 z-20"
          aria-label={liked ? 'Unlike product' : 'Like product'}
        >
          <LikeIcon
            isLiked={liked}
            heartStrokeColor="gray"
            heartFillColor={liked ? 'red' : 'none'}
            className="w-5 h-5"
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-1 px-2 pb-1 flex-grow overflow-hidden">
        <h3
          className={`text-base font-bold leading-5 text-gray-900 truncate ${isOutOfStock ? 'text-gray-600' : 'cursor-pointer'}`}
          title={safeProduct.p_name}
          onClick={isOutOfStock ? undefined : handleCardClick}
        >
          {safeProduct.p_name}
        </h3>
        <div className="flex items-start gap-0.5 flex-col">
          <span className="text-xs leading-4 text-gray-400 font-[600] truncate w-full">
            {safeProduct.shop_name}
          </span>
          <span className="text-xs leading-4 text-gray-400 truncate w-full">
            {safeProduct.c_name}
          </span>
        </div>

        {/* Price Display Section */}
        <div className="mt-auto">
          {isOutOfStock ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-gray-500 text-base font-bold leading-6 ${isOutOfStock ? 'line-through opacity-75' : ''}`}
                >
                  $
                  {convertThousandSeparator(
                    hasDiscount ? discountedPrice : safeProduct.p_price,
                    2
                  )}
                </span>
              </div>
              <motion.div
                className="flex items-center mt-1 gap-1"
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
              >
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-600 text-sm font-medium">
                  Out of stock
                </span>
              </motion.div>
            </div>
          ) : hasDiscount ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                {/* Discounted Price */}
                <motion.span
                  className="text-orange-500 text-base font-bold leading-6"
                  variants={priceRevealVariants}
                  initial="initial"
                  animate="animate"
                >
                  ${convertThousandSeparator(discountedPrice, 2)}
                </motion.span>

                {/* Original Price */}
                <motion.span
                  className="text-gray-400 text-xs line-through"
                  variants={priceRevealVariants}
                  initial="initial"
                  animate="animate"
                >
                  ${convertThousandSeparator(safeProduct.p_price, 2)}
                </motion.span>
              </div>

              {/* Savings Display */}
              {savingsAmount > 0 && (
                <AnimatePresence>
                  <motion.div
                    className="text-[10px] text-green-600 font-medium mt-0.5 flex items-center"
                    variants={savingsPulseVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="h-1 w-1 rounded-full bg-green-500 mr-1" />
                    <span>
                      Save ${convertThousandSeparator(savingsAmount, 2)}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ) : (
            <span className="text-orange-500 text-base font-bold leading-6">
              ${convertThousandSeparator(safeProduct.p_price, 1)}
            </span>
          )}

          {/* Stock indicator for low stock */}
          {safeProduct.p_stock <= 5 && safeProduct.p_stock > 0 && (
            <div className="text-[10px] text-amber-600 font-medium mt-0.5 flex items-center">
              <div className="h-1 w-1 rounded-full bg-amber-500 mr-1" />
              <span>Only {safeProduct.p_stock} left</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

ProductPreviewCard2.displayName = 'ProductPreviewCard2';
export default ProductPreviewCard2;
