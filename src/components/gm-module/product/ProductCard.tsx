import Image from 'next/image';
import React from 'react';

import { Product } from '@/core/entity/Product';

type ProductCardProps = {
  product: Product & {
    discountType?: 'percentage' | 'fixed';
    discountPercent?: number;
    discountAmount?: number;
    originalPrice?: number;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Calculate discount percentage based on discount type
  const hasDiscount =
    product.discountType &&
    (product.discountType === 'percentage'
      ? product.discountPercent! > 0
      : product.discountAmount! > 0);

  // Calculate the discounted price
  const discountedPrice = hasDiscount
    ? product.discountType === 'percentage'
      ? Math.round(
          product.price - product.price * (product.discountPercent! / 100)
        )
      : Math.round(product.price - (product.discountAmount || 0))
    : product.price;

  const discountPercentage = hasDiscount
    ? product.discountType === 'percentage'
      ? product.discountPercent!
      : Math.round((product.discountAmount! / product.price) * 100)
    : 0;

  // Generate star rating elements - using a default rating of 4
  const renderRating = () => {
    const stars = [];
    const rating = 4; // Default rating since it's not in the entity
    const fullStars = Math.floor(rating);

    // Add filled stars
    for (let index = 0; index < fullStars; index++) {
      stars.push(
        <span key={`star-filled-${index}`} className="text-[#EDB310]">
          ★
        </span>
      );
    }

    // Add empty stars
    for (let index = fullStars; index < 5; index++) {
      stars.push(
        <span key={`star-empty-${index}`} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="flex flex-col w-[180px] bg-white rounded-[6px] shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-[180px] w-full overflow-hidden rounded-t-[4px]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="180px"
          priority
        />
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col gap-1">
        {/* Title */}
        <h3 className="text-sm font-medium font-montserrat line-clamp-1 text-black">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-[10px] font-normal font-montserrat leading-[1.6em] text-black line-clamp-2 h-8">
          {product.description || ''}
        </p>

        {/* Price Section - only manage the promotion area height */}
        <div className="mt-1 flex flex-col">
          {/* Current Price */}
          <div className="flex items-baseline">
            <span className="text-lg font-semibold text-black">
              ₹{discountedPrice}
            </span>
          </div>

          {/* Use a fixed height container for promo info to ensure consistent height */}
          <div className="h-[28px]">
            {hasDiscount && (
              <div className="flex gap-x-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                </div>

                {/* Discount Percentage */}
                <div className="flex items-center">
                  <span className="text-sm font-medium text-[#FE735C]">
                    {discountPercentage}%Off
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">{renderRating()}</div>
          <span className="text-[10px] font-normal font-montserrat text-[#A4A9B3] ml-1">
            {Math.floor(Math.random() * 10_000)}{' '}
            {/* Random review count for demo */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
