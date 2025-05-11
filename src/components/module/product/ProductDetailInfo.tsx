'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import AddToCartIcon from '@/components/common/icons/AddToCartIcon';
import DeliveryTimeIcon from '@/components/common/icons/DeliveryTimeIcon';
import StarIcon from '@/components/common/icons/StarIcon';
import { ProductDetail } from '@/core/entity/Product';
import { useCart } from '@/lib/hooks/store/useCart';
import { RootState } from '@/lib/redux/ReduxStore';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

import RecommendedProducts from './RecommendedProducts';

interface ProductDetailInfoProps {
  product: ProductDetail;
  productPreviews?: any[];
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      duration: 0.4,
    },
  },
};

const pulsate = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
    },
  },
};

// Gradient shimmer effect for the savings text
const shimmer = {
  initial: { backgroundPosition: '-200px 0' },
  animate: {
    backgroundPosition: ['200px 0', '-200px 0'],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
};

// Moving gradient border effect for the container
const gradientBorder = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '0% 50%'],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'linear',
    },
  },
};

// Background sliding gradient animation
const slidingGradient = {
  initial: { backgroundPosition: '0% 0%' },
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%', '200% 0%', '0% 0%'],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: 'linear',
    },
  },
};

// Text highlight animation
const highlightText = {
  initial: { color: '#16a34a' },
  animate: {
    color: ['#16a34a', '#10b981', '#047857', '#10b981', '#16a34a'],
    textShadow: [
      '0 0 0px rgba(16, 185, 129, 0)',
      '0 0 6px rgba(16, 185, 129, 0.3)',
      '0 0 10px rgba(16, 185, 129, 0.5)',
      '0 0 6px rgba(16, 185, 129, 0.3)',
      '0 0 0px rgba(16, 185, 129, 0)',
    ],
    scale: [1, 1.02, 1.03, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut',
    },
  },
};

// Amounts bounce animation
const bounceAmount = {
  initial: { y: 0 },
  animate: {
    y: [0, -3, 0],
    transition: {
      repeat: Infinity,
      repeatDelay: 2.5,
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

function ProductDetailInfo({
  product,
  productPreviews,
}: ProductDetailInfoProps) {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(0);
  const selectedLanguage = useSelector(
    (state: RootState) => state.language.locale
  );

  // Ensure product is valid to prevent runtime errors
  const safeProduct = useMemo(() => {
    return (
      product || {
        id: 0,
        m_id: 0,
        m_name: '',
        p_name: t('product.productNotAvailable'),
        p_description: t('product.noDescriptionAvailable'),
        en_description: t('product.noDescriptionAvailable'),
        mm_description: t('product.noDescriptionAvailable'),
        th_description: t('product.noDescriptionAvailable'),
        cn_description: t('product.noDescriptionAvailable'),
        p_price: 0,
        p_stock: 0,
        c_name: t('product.unknownCategory'),
        shop_name: t('product.unknownShop'),
        discount_type: undefined,
        discount_percent: undefined,
        discount_amount: undefined,
        product_image: [
          {
            link: '/food-fallback.png',
            id: 0,
            p_id: 0,
            type: 0,
            created_at: '',
            updated_at: '',
          },
        ],
      }
    );
  }, [product, t]);

  // Calculate discount information
  const {
    hasDiscount,
    discountedPrice,
    originalPrice,
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
        originalPrice,
        discountLabel: undefined,
        savingsAmount: 0,
        percentOff: 0,
      };
    }

    let discountedPrice = originalPrice;
    let discountLabel = '';

    // Calculate discounted price
    if (
      safeProduct.discount_type === 'percentage' &&
      safeProduct.discount_percent
    ) {
      discountedPrice =
        originalPrice * (1 - safeProduct.discount_percent / 100);
      discountLabel = `${safeProduct.discount_percent}% OFF`;
    } else if (
      safeProduct.discount_type === 'fixed' &&
      safeProduct.discount_amount
    ) {
      const amountValue = Number.parseFloat(safeProduct.discount_amount);
      discountedPrice = Math.max(0, originalPrice - amountValue);
      discountLabel = `$${convertThousandSeparator(amountValue, 1)} OFF`;
    }

    // Ensure we round to 2 decimal places
    discountedPrice = Number(discountedPrice.toFixed(2));

    // Calculate savings
    const savingsAmount = Number((originalPrice - discountedPrice).toFixed(2));

    // Calculate percent off
    const percentOff = Math.round((savingsAmount / originalPrice) * 100);

    return {
      hasDiscount,
      discountedPrice,
      originalPrice,
      discountLabel,
      savingsAmount,
      percentOff,
    };
  }, [safeProduct]);

  // Calculate total price with discount applied
  const totalPrice = useMemo(() => {
    return hasDiscount ? quantity * discountedPrice : quantity * originalPrice;
  }, [quantity, hasDiscount, discountedPrice, originalPrice]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 0) setQuantity(previous => previous - 1);
  }, [quantity]);

  const handleIncreaseQuantity = useCallback(() => {
    if (quantity < safeProduct.p_stock) setQuantity(previous => previous + 1);
    else toast.error(t('product.noMoreItemsInStock'));
  }, [quantity, safeProduct.p_stock, t]);

  const handleAddToCart = useCallback(() => {
    if (quantity > 0) {
      addToCart({
        id: safeProduct.id,
        name: safeProduct.p_name,
        price: hasDiscount ? discountedPrice : safeProduct.p_price,
        image: safeProduct.product_image[0]?.link || '/food-fallback.png',
        quantity: quantity,
        merchant_id: safeProduct.m_id,
        type: safeProduct.discount_type,
        discount_percent: safeProduct.discount_percent,
        discount_amount: safeProduct.discount_amount,
        discount_price: hasDiscount ? discountedPrice : safeProduct.p_price,
      });
      setQuantity(0);
      toast.success(t('product.addedToCart'));
    } else {
      toast.error(t('product.selectQuantityFirst'));
    }
  }, [addToCart, quantity, safeProduct, hasDiscount, discountedPrice, t]);

  return (
    <div className="flex w-full h-full flex-col px-6 pt-4 pb-2 bg-white rounded-t-3xl z-20 transform -translate-y-16">
      {/* Product Name */}
      <h1 className="text-2xl font-semibold">{safeProduct.p_name}</h1>
      <span className="text-gray-500 text-md font-semibold">
        {safeProduct.shop_name || t('product.unknownShop')}
      </span>
      <span className="text-gray-400 text-sm font-semibold">
        {safeProduct.c_name || t('product.unknownCategory')}
      </span>
      <span className="text-gray-400 text-sm font-semibold">
        {t('product.itemsInStock')}&nbsp;-&nbsp;{safeProduct.p_stock}
      </span>

      {/* Price with Discount */}
      <div className="mt-3 flex items-center">
        {hasDiscount ? (
          <motion.div
            className="flex items-center gap-3"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="text-[#FE8C00] text-xl font-bold">
              ${convertThousandSeparator(discountedPrice, 2)}
            </span>
            <span className="text-gray-400 text-sm line-through">
              ${convertThousandSeparator(originalPrice, 2)}
            </span>

            <motion.div
              className="ml-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-xs font-medium"
              variants={pulsate}
              initial="initial"
              animate="animate"
            >
              {discountLabel}
            </motion.div>
          </motion.div>
        ) : (
          <span className="text-[#FE8C00] text-lg font-bold">
            ${convertThousandSeparator(safeProduct.p_price, 2)}
          </span>
        )}
      </div>

      {/* Savings Information */}
      <AnimatePresence>
        {hasDiscount && savingsAmount > 0 && (
          <motion.div
            className="mt-1.5 relative py-1 px-2.5 rounded-md overflow-hidden max-w-[85%]"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* Animated full gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 bg-[length:200%_200%] opacity-90"
              variants={slidingGradient}
              initial="initial"
              animate="animate"
            />

            {/* Content with improved contrast */}
            <div className="relative z-10 flex items-center gap-1.5 p-0.5">
              {/* Savings label with shimmer effect */}
              <motion.span
                className="font-semibold text-white drop-shadow-sm text-xs"
                variants={shimmer}
                initial="initial"
                animate="animate"
              >
                {t('product.youSave')}
              </motion.span>

              {/* Amount with bounce effect */}
              <motion.span
                className="font-bold text-white text-sm drop-shadow-sm"
                variants={bounceAmount}
                initial="initial"
                animate="animate"
              >
                ${convertThousandSeparator(savingsAmount, 2)}
              </motion.span>

              {/* Percentage with highlight effect */}
              <motion.span
                className="font-bold rounded-full bg-white px-1.5 py-0.5 text-xs text-emerald-600 shadow-sm"
                variants={highlightText}
                initial="initial"
                animate="animate"
              >
                ({percentOff}% OFF)
              </motion.span>

              {/* Decorative elements */}
              <motion.span
                className="ml-auto text-sm text-white"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
              >
                ✨
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Bar */}
      {/* <div className="flex w-full items-center justify-between bg-[#FE8C000A] p-2 rounded-lg mt-4">
        <div>
          <span className="text-[#FE8C00] text-sm font-extrabold font-poppins">
            $&nbsp;
          </span>
          <span className="text-[#878787] text-sm">{t('product.freeDelivery')}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <DeliveryTimeIcon />
          <span className="text-sm text-[#878787]">20-30</span>
        </div>
        <div className="flex items-center gap-x-2">
          <StarIcon />
          <span className="text-sm text-[#878787]">4.9</span>
        </div>
      </div> */}

      {/* Description */}
      <h2 className="mt-8 text-base font-semibold text-[#101010]">
        {t('product.description')}
      </h2>
      <p className="text-[#878787] text-sm mt-2">
        {selectedLanguage === 'mm'
          ? safeProduct.mm_description
          : selectedLanguage === 'th'
            ? safeProduct.th_description
            : selectedLanguage === 'cn'
              ? safeProduct.cn_description
              : selectedLanguage === 'en'
                ? safeProduct.en_description
                : t('product.noDescriptionAvailable')}
      </p>

      {/* Quantity and Total */}
      <div className="flex w-full items-center justify-between mt-5">
        <div className="flex gap-x-3 pl-4">
          <button
            onClick={handleDecreaseQuantity}
            className="focus:outline-none"
            aria-label={t('product.decreaseQuantity')}
          >
            <MinusIcon className="w-6 h-6" />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            className="focus:outline-none"
            aria-label={t('product.increaseQuantity')}
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
        <motion.div
          className="text-[#FE8C00] text-2xl font-semibold"
          key={totalPrice} // Re-animate when price changes
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          ${convertThousandSeparator(totalPrice, 0)}
        </motion.div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex w-full items-center justify-center mt-5 mb-4">
        <motion.button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-x-2 bg-[#FE8C00] py-4 rounded-full transition-colors hover:bg-[#e07e00] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={quantity === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AddToCartIcon />
          <span className="text-white text-sm font-semibold">
            {t('product.addToCart')}
          </span>
        </motion.button>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts product={safeProduct} />
    </div>
  );
}

export default ProductDetailInfo;
