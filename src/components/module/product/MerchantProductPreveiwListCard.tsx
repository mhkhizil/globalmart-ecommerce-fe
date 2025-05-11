'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, Percent, Tag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HTMLAttributes, memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import LikeIcon from '@/components/common/icons/LikeIcon';
import StarIcon from '@/components/common/icons/StarIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProductDetail } from '@/core/entity/Product';
import { useCreateDiscount } from '@/lib/hooks/service/merchant/useCreateDiscount';
import { useSession } from '@/lib/hooks/session/useSession';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

// Types
interface ProductPreviewCardProps extends HTMLAttributes<HTMLDivElement> {
  product: ProductDetail;
}

// Constants
const IMAGE_FALLBACK_SRC = '/food-fallback.png'; // Ensure this exists in /public
const IMAGE_SIZES = '(max-width: 768px) 33vw, 25vw';
const IMAGE_DIMENSIONS = { width: 512, height: 512 } as const;
const DEFAULT_RESTAURANT = 'Unknown Restaurant';

// Utility Component for Price Display
const PriceDisplay: React.FC<{ price: number }> = memo(({ price }) => (
  <span className="text-orange-500 font-bold text-base leading-6">
    ${convertThousandSeparator(price, 1)}
  </span>
));
PriceDisplay.displayName = 'PriceDisplay';

// Main Component
const MerchantProductPreveiwListCard = memo(
  ({ product, className, ...rest }: ProductPreviewCardProps) => {
    const router = useRouter();
    const t = useTranslations();
    const [imageSource, setImageSource] = useState(
      product.p_image || IMAGE_FALLBACK_SRC
    );
    const { data: sessionData } = useSession();
    const [showDiscountForm, setShowDiscountForm] = useState(false);
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
      'percentage'
    );
    const [discountValue, setDiscountValue] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [responseStatus, setResponseStatus] = useState<{
      type: 'success' | 'error' | undefined;
      message: string;
    }>({ type: undefined, message: '' });

    // Safe product data with fallbacks
    const safeProduct = useMemo(
      () => ({
        id: product.id || 'unknown',
        p_name: product.p_name || 'Unnamed Product',
        p_price: product.p_price || 0,
        p_stock: product.p_stock ?? 0, // Nullish coalescing for undefined
        shop_name: product.shop_name || DEFAULT_RESTAURANT,
      }),
      [product]
    );

    const { mutate: createDiscount, isPending: isCreatingDiscount } =
      useCreateDiscount({
        onSuccess: () => {
          setResponseStatus({
            type: 'success',
            message:
              'Discount created successfully! The page will refresh shortly.',
          });

          // Auto close after showing success message
          setTimeout(() => {
            setShowDiscountForm(false);
            resetForm();
          }, 2500);

          toast.success('Discount created successfully');
        },
        onError: error => {
          setResponseStatus({
            type: 'error',
            message:
              error.message || 'Failed to create discount. Please try again.',
          });
          toast.error(error.message || 'Failed to create discount');
        },
      });

    // Form helpers
    const resetForm = useCallback(() => {
      setDiscountType('percentage');
      setDiscountValue('');
      setStartDate('');
      setEndDate('');
      setResponseStatus({ type: undefined, message: '' });
    }, []);

    const calculateDiscountedPrice = useCallback(() => {
      const price = safeProduct.p_price;
      if (!discountValue || Number.isNaN(Number(discountValue))) return price;

      const value = Number.parseFloat(discountValue);
      if (discountType === 'percentage') {
        if (value <= 0 || value > 100) return price;
        return price - (price * value) / 100;
      } else {
        if (value <= 0 || value >= price) return price;
        return price - value;
      }
    }, [safeProduct.p_price, discountValue, discountType]);

    const discountedPrice = calculateDiscountedPrice();

    // Handlers
    const handleClick = useCallback(() => {
      //router.push(`/application/product/detail/${safeProduct.id}`);
    }, []);

    const handleImageError = useCallback(() => {
      setImageSource(IMAGE_FALLBACK_SRC); // Switch to fallback once
    }, []);

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formatDateForAPI = useCallback((dateString: string) => {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }, []);

    // Animation variants
    const overlayVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
    };

    return (
      <>
        <article
          className={clsx(
            'flex w-full max-h-[7rem] min-h-[7rem] flex-shrink-0 gap-2 p-2 rounded-md shadow-md border border-gray-200 bg-white cursor-pointer transition-shadow hover:shadow-lg relative',
            className
          )}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={event => event.key === 'Enter' && handleClick()}
          aria-label={`View details for ${safeProduct.p_name}`}
          {...rest}
        >
          {/* Image Container */}
          <div className="relative w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={imageSource}
              alt={safeProduct.p_name}
              width={IMAGE_DIMENSIONS.width}
              height={IMAGE_DIMENSIONS.height}
              sizes={IMAGE_SIZES}
              className="w-full h-full object-cover"
              priority={false} // Lazy load by default
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+/ahAQI8A/8BOz8L9gAAAABJRU5ErkJggg==" // Low-quality placeholder
              onError={handleImageError}
            />
          </div>

          {/* Content Container */}
          <div className="flex flex-1 flex-col gap-y-1 py-1 min-w-0">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 truncate">
              {safeProduct.p_name}
            </h3>
            <div className="flex items-center gap-1">
              {/* Uncomment when rating is available */}
              {/* <StarIcon className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span className="text-xs leading-4 text-gray-600">{rating ?? 'N/A'}</span> */}
              <span className="text-xs leading-4 text-gray-500/70 font-semibold truncate">
                {safeProduct.shop_name}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <PriceDisplay price={safeProduct.p_price} />
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium h-7 px-2 flex-shrink-0"
                onClick={event => {
                  event.stopPropagation();
                  setShowDiscountForm(true);
                }}
              >
                <Tag className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs">Add Discount</span>
              </Button>
            </div>
          </div>
        </article>

        {/* Discount Form Dialog */}
        <Dialog
          open={showDiscountForm}
          onOpenChange={open => {
            if (!open) {
              resetForm();
            }
            setShowDiscountForm(open);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Create Discount
              </DialogTitle>
              <DialogDescription>
                Create a discount for {safeProduct.p_name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {responseStatus.type && (
                <motion.div
                  className={clsx('p-3 rounded-md', {
                    'bg-green-50 border border-green-200':
                      responseStatus.type === 'success',
                    'bg-red-50 border border-red-200':
                      responseStatus.type === 'error',
                  })}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start">
                    {responseStatus.type === 'success' ? (
                      <div className="flex-shrink-0 text-green-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 text-red-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="ml-3">
                      <p
                        className={clsx('text-sm font-medium', {
                          'text-green-800': responseStatus.type === 'success',
                          'text-red-800': responseStatus.type === 'error',
                        })}
                      >
                        {responseStatus.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Product
                </label>
                <Input
                  value={safeProduct.p_name}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Price
                </label>
                <Input
                  value={`$${convertThousandSeparator(safeProduct.p_price, 1)}`}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <RadioGroup
                  value={discountType}
                  onValueChange={value =>
                    setDiscountType(value as 'percentage' | 'fixed')
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <label
                      htmlFor="percentage"
                      className="flex items-center text-sm font-medium cursor-pointer"
                    >
                      <Percent className="w-4 h-4 mr-1 text-orange-500" />
                      Percentage
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <label
                      htmlFor="fixed"
                      className="flex items-center text-sm font-medium cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      Fixed Amount
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {discountType === 'percentage'
                    ? 'Percentage Value (%)'
                    : 'Amount Value ($)'}
                </label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={event => setDiscountValue(event.target.value)}
                  placeholder={discountType === 'percentage' ? '10' : '5.99'}
                  min={0}
                  max={
                    discountType === 'percentage' ? 100 : safeProduct.p_price
                  }
                  step={discountType === 'percentage' ? 1 : 0.01}
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={event => setStartDate(event.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Format: DD/MM/YYYY
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={event => setEndDate(event.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="focus:border-orange-500 focus:ring-orange-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Format: DD/MM/YYYY
                  </div>
                </div>
              </div>

              {discountValue && !Number.isNaN(Number(discountValue)) && (
                <motion.div
                  className="p-3 bg-gray-50 rounded-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Discounted Price:
                    </span>
                    <span className="text-lg font-bold text-orange-500">
                      ${convertThousandSeparator(discountedPrice, 1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {discountType === 'percentage'
                      ? `${discountValue}% off original price`
                      : `$${discountValue} off original price`}
                  </div>
                </motion.div>
              )}
            </div>

            <DialogFooter className="gap-x-2 gap-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDiscountForm(false);
                  resetForm();
                }}
                disabled={isCreatingDiscount}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  // Reset any previous response status
                  setResponseStatus({ type: undefined, message: '' });

                  // Convert dates to DD/MM/YYYY format before submitting
                  const formattedStartDate = formatDateForAPI(startDate);
                  const formattedEndDate = formatDateForAPI(endDate);

                  // Call the createDiscount function with the formatted data
                  if (!sessionData?.user?.merchant_id) {
                    setResponseStatus({
                      type: 'error',
                      message: 'Merchant ID is required',
                    });
                    return;
                  }

                  if (!startDate || !endDate) {
                    setResponseStatus({
                      type: 'error',
                      message: 'Start and end dates are required',
                    });
                    return;
                  }

                  if (!discountValue || Number.isNaN(Number(discountValue))) {
                    setResponseStatus({
                      type: 'error',
                      message: 'Valid discount value is required',
                    });
                    return;
                  }

                  const value = Number.parseFloat(discountValue);
                  if (
                    discountType === 'percentage' &&
                    (value <= 0 || value > 100)
                  ) {
                    setResponseStatus({
                      type: 'error',
                      message: 'Percentage must be between 1-100',
                    });
                    return;
                  }

                  if (
                    discountType === 'fixed' &&
                    (value <= 0 || value >= safeProduct.p_price)
                  ) {
                    setResponseStatus({
                      type: 'error',
                      message: 'Amount must be less than product price',
                    });
                    return;
                  }

                  // Create a new object with the formatted dates
                  const discountData = {
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                    merchant_id: Number(sessionData?.user?.merchant_id),
                    product_id: Number(safeProduct.id),
                    product_name: safeProduct.p_name,
                    product_price: safeProduct.p_price,
                    type: discountType,
                    discount_percent:
                      discountType === 'percentage'
                        ? Number.parseFloat(discountValue)
                        : 0,
                    discount_amount:
                      discountType === 'fixed'
                        ? Number.parseFloat(discountValue)
                        : 0,
                    discount_price: discountedPrice,
                  };

                  createDiscount(discountData);
                }}
                disabled={
                  isCreatingDiscount || responseStatus.type === 'success'
                }
              >
                {isCreatingDiscount ? (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 bg-white rounded-full mr-1"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-white rounded-full mr-1"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: 0.1,
                      }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: 0.2,
                      }}
                    />
                  </motion.div>
                ) : (
                  <>
                    <Tag className="w-4 h-4 mr-1" />
                    Create Discount
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

MerchantProductPreveiwListCard.displayName = 'MerchantProductPreveiwListCard';
export default MerchantProductPreveiwListCard;
