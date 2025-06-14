'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import FallbackImage from '@/components/common/FallbackImage';
import DeleteIcon from '@/components/common/icons/DeleteIcon';
import { CartItem as CartItemType } from '@/lib/type/cart';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

interface CartItemProps {
  addToCart: (item: CartItemType) => void;
  decreaseQuantity: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  item: CartItemType;
  confirmItems: number[];
  setConfirmItem: Dispatch<SetStateAction<number[]>>;
}

const CartItem = memo(function CartItem({
  item,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  confirmItems,
  setConfirmItem,
}: CartItemProps) {
  const t = useTranslations();
  const [isChecked, setIsChecked] = useState<boolean>(
    confirmItems.includes(item.id)
  );
  const {
    image,
    quantity,
    name,
    price,
    id,
    type,
    discount_percent,
    discount_amount,
    discount_price,
  } = item;

  const formattedPrice = convertThousandSeparator(quantity * price, 2);

  // Calculate discount information
  const discountInfo = useMemo(() => {
    if (!type || (!discount_percent && !discount_amount)) {
      return { hasDiscount: false };
    }

    // Calculate original price
    let originalPrice = price;
    let originalTotalPrice = originalPrice * quantity;
    let discountedTotalPrice = price * quantity;
    let discountLabel = '';

    if (type === 'percentage' && discount_percent) {
      // If we have discounted price, calculate original price
      originalPrice = price / (1 - discount_percent / 100);
      originalTotalPrice = originalPrice * quantity;
      discountLabel = `${discount_percent}% OFF`;
    } else if (type === 'fixed' && discount_amount) {
      // If fixed discount, add it back to get original price
      originalPrice = price + Number(discount_amount);
      originalTotalPrice = originalPrice * quantity;
      discountLabel = `$${convertThousandSeparator(Number(discount_amount), 1)} OFF`;
    }

    const formattedOriginalPrice = convertThousandSeparator(
      originalTotalPrice,
      2
    );
    const savingsAmount = originalTotalPrice - discountedTotalPrice;
    const formattedSavings = convertThousandSeparator(savingsAmount, 2);

    return {
      hasDiscount: true,
      originalTotalPrice: formattedOriginalPrice,
      discountLabel,
      savingsAmount: formattedSavings,
    };
  }, [price, quantity, type, discount_percent, discount_amount]);

  const handleDecrease = useCallback(() => {
    if (quantity > 1) {
      decreaseQuantity(id);
    } else {
      removeFromCart(id);
    }
  }, [decreaseQuantity, id, quantity, removeFromCart]);

  const handleIncrease = useCallback(() => {
    addToCart({ ...item, quantity: 1 });
  }, [addToCart, item]);

  const handleRemove = useCallback(() => {
    removeFromCart(id);
  }, [removeFromCart, id]);

  const handleToggleSelection = useCallback(() => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    setConfirmItem(previous => {
      return previous.includes(id)
        ? previous.filter(itemId => itemId !== id)
        : [...previous, id];
    });
  }, [id, isChecked, setConfirmItem]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="flex w-full justify-between gap-x-[1rem] items-center shadow-cart-item-box py-[0.813rem] px-[0.75rem] rounded-lg">
      {/* Checkbox is commented out in the original code, but I'm keeping it with improved implementation
      <div className="flex-shrink-0">
        <Checkbox
          id={`cart-item-${id}`}
          checked={isChecked}
          className={clsx('stroke-yellow-400 rounded-[4px]', {
            'border-0': isChecked,
          })}
          onClick={handleToggleSelection}
          aria-label={`${t('common.select')} ${name}`}
        />
      </div> */}
      <div className="flex size-24 flex-shrink-0">
        <FallbackImage
          src={image}
          fallbackSrc="/food-fallback.png"
          alt={`${name} ${t('common.image')}`}
          width={256}
          height={256}
          className="h-full w-full rounded-[0.5rem] object-fit"
          priority={false}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col w-full">
        <span className="text-[#101010] text-[1rem] leading-[1.5rem] font-[600] line-clamp-1">
          {name}
        </span>

        {discountInfo.hasDiscount ? (
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <span className="text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[700]">
                ${formattedPrice}
              </span>
              <span className="text-gray-400 text-[0.75rem] line-through">
                ${discountInfo.originalTotalPrice}
              </span>
              <motion.div
                className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md text-[0.625rem] font-medium"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                {discountInfo.discountLabel}
              </motion.div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-emerald-600 text-[0.625rem] font-medium"
            >
              You save: ${discountInfo.savingsAmount}
            </motion.div>
          </div>
        ) : (
          <span className="text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[700] mt-[4px] mb-[8px]">
            ${formattedPrice}
          </span>
        )}

        <div className="flex w-full justify-between items-center mt-2">
          <div className="flex items-center justify-between gap-x-[1rem]">
            <button
              onClick={handleDecrease}
              className="rounded-full border-[1px] border-[#EDEDED] p-1 hover:bg-gray-100 transition-colors"
              aria-label={t('cart.decreaseQuantity')}
            >
              <Minus size={16} />
            </button>
            <span className="min-w-[1.5rem] text-center">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="rounded-full border-[1px] border-[#EDEDED] p-1 hover:bg-gray-100 transition-colors"
              aria-label={t('cart.increaseQuantity')}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('cart.removeItem')}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
