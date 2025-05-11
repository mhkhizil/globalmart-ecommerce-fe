'use client';

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
    }),
    [product]
  );

  // Handlers
  const handleCardClick = useCallback(() => {
    // router.push(`/application/product/detail/${safeProduct.id}`);
  }, []);

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
      className="flex w-full flex-col flex-shrink-0 gap-2 p-1 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow duration-200 h-[230px]"
      key={safeProduct.id}
    >
      {/* Image Section */}
      <div
        className="relative w-full h-[106px] cursor-pointer rounded-lg overflow-hidden"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${safeProduct.p_name}`}
        onKeyDown={event => event.key === 'Enter' && handleCardClick()}
      >
        <Image
          src={imageSource}
          alt={safeProduct.p_name}
          width={IMAGE_DIMENSIONS.width}
          height={IMAGE_DIMENSIONS.height}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          priority={false} // Lazy load by default
          placeholder={hasImageFailed ? 'empty' : 'blur'} // No blur if ultimate fallback
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+/ahAQI8A/8BOz8L9gAAAABJRU5ErkJggg=="
          onError={handleImageError}
        />
        {/* Like Button */}
        <button
          onClick={event => {
            event.stopPropagation(); // Prevent card click
            handleLikeToggle();
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white ocus:outline-none focus:ring-0"
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
      <div className="flex flex-col gap-1 px-2 pb-2 flex-grow overflow-hidden">
        <h3
          className="text-base font-bold cursor-pointer leading-6 text-gray-900 truncate"
          title={safeProduct.p_name}
        >
          {safeProduct.p_name}
        </h3>
        <div className="flex items-start gap-1 flex-col">
          {/* Uncomment if rating is added to ProductDetail */}
          {/* <StarIcon className="w-4 h-4 text-yellow-400" aria-hidden="true" />
          <span className="text-xs leading-4 text-gray-600">{rating || 'N/A'}</span> */}
          <span className="text-xs leading-4 text-gray-400 font-[600] truncate w-full">
            {safeProduct.shop_name}
          </span>
          <span className="text-xs leading-4 text-gray-400 truncate w-full">
            {safeProduct.c_name}
          </span>
        </div>
        <span className="text-orange-500 text-base font-bold leading-6">
          ${convertThousandSeparator(safeProduct.p_price, 1)}
        </span>
      </div>
    </article>
  );
});

ProductPreviewCard2.displayName = 'ProductPreviewCard2';
export default ProductPreviewCard2;
