'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ProductDetail } from '@/core/entity/Product';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

// Constants
const IMAGE_DIMENSIONS = {
  width: 300,
  height: 300,
};

const IMAGE_SIZES = '(max-width: 640px) 50vw, 25vw';

// Fallback image for when product image fails to load
const FALLBACK_IMAGE = '/images/placeholder-product.svg';

interface MerchantProductCardProps {
  product: ProductDetail;
  className?: string;
}

export default function MerchantProductCard({
  product,
  className,
}: MerchantProductCardProps) {
  const router = useRouter();
  const [hasImageFailed, setHasImageFailed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Safely access product properties with fallbacks
  const safeProduct = {
    id: product?.id || 0,
    p_id: product?.p_id || 0,
    p_name: product?.p_name || 'Unknown Product',
    p_price: product?.p_price || 0,
    p_image: product?.p_image || FALLBACK_IMAGE,
    shop_name: product?.shop_name || 'Unknown Shop',
    c_name: product?.c_name || 'Uncategorized',
    en_description: product?.en_description || 'No description available',
  };

  // Determine image source with fallback
  const imageSource = hasImageFailed ? FALLBACK_IMAGE : safeProduct.p_image;

  // Handle image loading error
  const handleImageError = () => {
    setHasImageFailed(true);
  };

  // Navigate to product detail page
  const handleCardClick = () => {
    router.push(`/application/product/detail/${safeProduct.p_id}`);
  };

  // Toggle like status
  const handleLikeToggle = () => {
    setIsLiked(previous => !previous);
  };

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col bg-white rounded-xl shadow-md overflow-hidden h-[250px] ${className}`}
    >
      {/* Image Section with Like Button */}
      <div className="relative w-full h-[150px]">
        <div
          className="absolute inset-0 cursor-pointer"
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
            sizes={IMAGE_SIZES}
            className="w-full h-full object-cover"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+/ahAQI8A/8BOz8L9gAAAABJRU5ErkJggg=="
            onError={handleImageError}
          />
        </div>

        {/* Like Button */}
        <button
          onClick={event => {
            event.stopPropagation();
            handleLikeToggle();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white focus:outline-none"
          aria-label={isLiked ? 'Unlike product' : 'Like product'}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div
        className="flex flex-col p-3 flex-grow cursor-pointer"
        onClick={handleCardClick}
      >
        <h3
          className="font-bold text-gray-900 truncate"
          title={safeProduct.p_name}
        >
          {safeProduct.p_name}
        </h3>

        <div className="flex flex-col mt-1 space-y-0.5">
          <span className="text-xs text-gray-500 font-medium truncate">
            {safeProduct.shop_name}
          </span>
          <span className="text-xs text-gray-400 truncate">
            {safeProduct.c_name}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <span className="text-orange-500 font-bold">
            ${convertThousandSeparator(safeProduct.p_price, 2)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
