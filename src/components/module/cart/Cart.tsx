'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Sparkles, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import BackIcon from '@/components/common/icons/BackIcon';
import DetailIcon from '@/components/common/icons/DetailIcon';
import EmptyCartIcon from '@/components/common/icons/EmptyCartIcon';
import PromoCodeIcon from '@/components/common/icons/PromoCodeIcon';
import Loader from '@/components/common/loader/Loader';
import { useSession } from '@/lib/hooks/session/useSession';
import { useCart } from '@/lib/hooks/store/useCart';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

import CartItem from './Cartitem';

function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionUser = useMemo(() => session?.user, [session?.user]);
  const { items, addToCart, decreaseQuantity, removeFromCart, clearCart } =
    useCart();

  const [confirmItems, setConfirmItem] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const t = useTranslations();

  // Calculate total cost using useMemo to avoid unnecessary recalculations
  const { totalCost, totalDiscount, originalTotalCost, totalSavingsPercent } =
    useMemo(() => {
      let discount = 0;
      let original = 0;
      const total = items.reduce((total, item) => {
        // Calculate individual item's discount contribution to total
        const itemQuantity = item.quantity || 1;
        const itemDiscountedPrice = item.price;

        // If we have discount info, calculate the original price and the discount amount
        if (item.type && (item.discount_percent || item.discount_amount)) {
          let itemOriginalPrice = itemDiscountedPrice;

          if (item.type === 'percentage' && item.discount_percent) {
            // Original price = discounted price / (1 - discount_percent/100)
            itemOriginalPrice =
              itemDiscountedPrice / (1 - item.discount_percent / 100);
          } else if (item.type === 'fixed' && item.discount_amount) {
            // Original price = discounted price + discount_amount
            itemOriginalPrice =
              itemDiscountedPrice + Number(item.discount_amount);
          }

          const itemDiscount =
            (itemOriginalPrice - itemDiscountedPrice) * itemQuantity;
          discount += itemDiscount;
          original += itemOriginalPrice * itemQuantity;
        } else {
          // If no discount, original price = discounted price
          original += itemDiscountedPrice * itemQuantity;
        }

        return total + itemDiscountedPrice * itemQuantity;
      }, 0);

      // Calculate savings as a percentage
      const savingsPercent =
        original > 0 ? Math.round((discount / original) * 100) : 0;

      return {
        totalCost: total,
        totalDiscount: discount,
        originalTotalCost: original,
        totalSavingsPercent: savingsPercent,
      };
    }, [items]);

  const formattedTotalCost = useMemo(() => {
    return convertThousandSeparator(totalCost, 2);
  }, [totalCost]);

  const formattedTotalDiscount = useMemo(() => {
    return convertThousandSeparator(totalDiscount, 2);
  }, [totalDiscount]);

  const errorMessage = useMemo(() => {
    if (items.length === 0) {
      return t('cart.yourCartIsEmpty');
    }
    return t('cart.pleaseLoginToSubmitOrder');
  }, [items, t]);

  const handleNavigateToPayment = useCallback(() => {
    if (!sessionUser) {
      toast.error(t('cart.pleaseLoginToSubmitOrder'));
      return;
    }

    if (items.length === 0) {
      toast.error(t('cart.yourCartIsEmpty'));
      return;
    }

    router.push('/application/payment');
  }, [items, router, sessionUser, t]);

  const handlePromoCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPromoCode(event.target.value);
    },
    []
  );

  const handleApplyPromoCode = useCallback(() => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    // Implement promo code logic here
    toast.success('Promo code functionality not implemented yet');
  }, [promoCode]);

  const navigateToProductList = useCallback(() => {
    router.push('/application/product/list');
  }, [router]);

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

  // Shimmer effect for discounts
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

  // New sparkle animation variant
  const sparkle = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 1.5,
        delay: 0.5,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  // Sliding gradient animation for discount section
  const slidingGradient = {
    initial: { backgroundPosition: '0% 0%' },
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      transition: {
        repeat: Infinity,
        duration: 8,
        ease: 'linear',
      },
    },
  };

  // Render empty cart state
  if (items.length === 0) {
    return (
      <div className="flex w-full h-full flex-col max-h-[92dvh] relative">
        <Toaster />
        <div className="flex w-full items-center justify-between px-[1.5rem] pt-[0.75rem] flex-shrink-0 sticky top-0 bg-white z-10">
          <button onClick={() => router.back()} aria-label="Go back">
            <BackIcon />
          </button>
          <span className="text-[1rem] font-semibold">{t('cart.myCart')}</span>
          <button aria-label="Details">
            <DetailIcon />
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
            className="flex w-full items-center mt-[2.5rem] justify-center bg-[#FE8C00] py-[1rem] rounded-[6.25rem] hover:bg-[#e07e00] transition-colors"
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
    <div className="flex w-full h-full flex-col max-h-[92dvh] relative">
      <Toaster position="top-center" />
      <div className="flex w-full items-center justify-between px-[1.5rem] pt-[0.75rem] flex-shrink-0 sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} aria-label="Go back">
          <BackIcon />
        </button>
        <span className="text-[1rem] font-semibold">{t('cart.myCart')}</span>
        <button aria-label="Details">
          <DetailIcon />
        </button>
      </div>

      <div className="flex w-full flex-col flex-shrink-0">
        <div className="flex w-full justify-between px-[1.5rem] items-center mt-[1rem] mb-[1rem]">
          <div className="flex flex-col">
            <span className="text-[#878787] text-[0.875rem] font-[400] leading-[1.25rem]">
              {t('cart.deliveryLocation')}
            </span>
            <span className="text-[#101010] text-[0.875rem] font-[600] leading-[1.25rem]">
              {t('cart.home')}
            </span>
          </div>
          <button
            onClick={() =>
              sessionUser
                ? router.push('/application/personal-data')
                : router.push('/login')
            }
            className="py-[0.5rem] px-[0.875rem] border-[#FE8C00] border-[0.5px] rounded-[100px] text-[#FE8C00] text-[0.625rem] font-[600] leading-[1rem] hover:bg-[#FE8C00]/10 transition-colors"
            aria-label="Change delivery location"
          >
            {sessionUser ? t('cart.changeLocation') : t('cart.login')}
          </button>
        </div>

        {/* promo code */}
        {/* <div className="flex w-full px-[1.5rem] sticky top-[3rem] bg-white z-10">
          <div className="flex w-full items-center rounded-[100px] gap-x-[0.625rem] border-[1px] border-[#EDEDED] py-[0.5rem] px-[0.75rem]">
            <PromoCodeIcon />
            <input
              placeholder={t('cart.promoCode')}
              className="flex w-full focus:outline-none"
              value={promoCode}
              onChange={handlePromoCodeChange}
              aria-label="Enter promo code"
            />
            <button
              className="text-white text-[0.75rem] text-nowrap font-[600] leading-[1rem] py-[0.625rem] bg-[#FE8C00] rounded-[100px] px-[1.406rem] hover:bg-[#e07e00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApplyPromoCode}
              disabled={!promoCode.trim()}
              aria-label="Apply promo code"
            >
              {t('cart.apply')}
            </button>
          </div>
        </div> */}

        {/* Display total discount if available */}
        <AnimatePresence>
          {totalDiscount > 0 && (
            <motion.div
              className="mx-6 mt-4 relative overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 bg-[length:200%_200%] opacity-10 rounded-lg"
                variants={slidingGradient}
                initial="initial"
                animate="animate"
              />
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-medium">
                    {t('cart.totalSavings')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.span
                    className="text-emerald-700 font-bold"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    ${formattedTotalDiscount}
                  </motion.span>
                  {/* {totalSavingsPercent > 0 && (
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                      {totalSavingsPercent}% {t('cart.off')}
                    </span>
                  )} */}
                  <motion.div
                    variants={sparkle}
                    initial="initial"
                    animate="animate"
                    className="relative"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-2 -right-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex w-full flex-col pt-[2rem] pb-[1rem] px-[1.5rem] gap-y-[1rem]">
          {items.map(item => (
            <div className="flex w-full" key={item.id}>
              <CartItem
                addToCart={addToCart}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
                item={item}
                confirmItems={confirmItems}
                setConfirmItem={setConfirmItem}
              />
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-center">
          <button
            onClick={navigateToProductList}
            className="flex items-center px-[1rem] py-[0.3rem] border-[1px] rounded-[4px] gap-x-1 shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Add more items"
          >
            <Plus size={16} /> {t('cart.addMoreItems')}
          </button>
        </div>
      </div>
      {/* Payment Summary */}
      <div className="flex w-full px-[1.5rem] items-end justify-end flex-shrink-0 flex-col gap-y-[1.5rem] pt-[1rem]">
        <div className="flex w-full flex-col border-[#EDEDED] border-[1px] rounded-[1rem] p-[0.75rem]">
          <h3 className="text-[#101010] text-[1rem] font-[600] leading-[1.5rem]">
            {t('cart.paymentSummary')}
          </h3>

          <div className="flex w-full items-center justify-between mt-[0.5rem]">
            <span className="text-[#878787] text-[0.875rem] font-[500] leading-[1.25rem]">
              {t('cart.totalItems', { count: items.length })}
            </span>
            {totalDiscount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[0.75rem] line-through">
                  ${convertThousandSeparator(originalTotalCost, 2)}
                </span>
                <span className="text-[#101010] text-[0.875rem] font-[700] leading-[1.25rem]">
                  ${formattedTotalCost}
                </span>
              </div>
            ) : (
              <span className="text-[#101010] text-[0.875rem] font-[700] leading-[1.25rem]">
                ${formattedTotalCost}
              </span>
            )}
          </div>

          <div className="flex w-full items-center justify-between mt-[1rem]">
            <span className="text-[#878787] text-[0.875rem] font-[500] leading-[1.25rem]">
              {t('cart.deliveryFee')}
            </span>
            <span className="text-[#101010] text-[0.875rem] font-[700] leading-[1.25rem]">
              {t('cart.free')}
            </span>
          </div>

          {totalDiscount > 0 && (
            <motion.div
              className="flex w-full items-center justify-between mt-[1rem]"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <span className="text-[#878787] text-[0.875rem] font-[500] leading-[1.25rem]">
                {t('cart.discount')}
              </span>
              <motion.span
                className="text-emerald-600 text-[0.875rem] font-[700] leading-[1.25rem]"
                variants={shimmer}
                initial="initial"
                animate="animate"
              >
                -${formattedTotalDiscount}
              </motion.span>
            </motion.div>
          )}

          <div className="flex w-full items-center justify-between mt-[1rem]">
            <span className="text-[#878787] text-[0.875rem] font-[500] leading-[1.25rem]">
              {t('cart.total')}
            </span>
            <span className="text-[#101010] text-[0.875rem] font-[700] leading-[1.25rem]">
              ${formattedTotalCost}
            </span>
          </div>

          {totalDiscount > 0 && (
            <motion.div
              className="flex w-full mt-[1rem] py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex w-full justify-between items-center">
                <span className="text-emerald-700 text-[0.75rem] font-medium">
                  {t('cart.youSaved')}
                </span>
                <motion.span
                  className="text-emerald-700 text-[0.875rem] font-bold"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  ${formattedTotalDiscount}
                </motion.span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex w-full mb-[2rem]">
          {sessionUser ? (
            <button
              onClick={handleNavigateToPayment}
              disabled={items.length === 0}
              className={clsx(
                'rounded-[100px] py-[16px] min-h-[52px] w-full text-[14px] font-semibold leading-[20px] text-white transition-colors',
                {
                  'bg-[#FE8C00] hover:bg-[#e07e00]': items.length > 0,
                  'bg-[#FE8C00]/70 cursor-not-allowed': items.length === 0,
                }
              )}
              aria-label="Proceed to payment"
            >
              <span className="text-white text-[0.875rem] leading-[1.25rem] font-[600]">
                {t('cart.proceedToPayment')}
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-[100px] text-center py-[16px] min-h-[52px] w-full text-[14px] font-semibold leading-[20px] text-white transition-colors bg-[#FE8C00] hover:bg-[#e07e00]"
            >
              {t('cart.login')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
