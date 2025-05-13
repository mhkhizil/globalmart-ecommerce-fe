import Image from 'next/image';
import React from 'react';

import { Product } from '@/core/models/Product';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );

  // Generate star rating elements
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);

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
          src={product.imageUrl}
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
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium font-montserrat text-black">
            ₹{product.discountedPrice}
          </span>
          {product.originalPrice > product.discountedPrice && (
            <div className="flex items-center">
              <span className="text-xs font-light font-montserrat text-[#808488] line-through">
                ₹{product.originalPrice}
              </span>
              <div className="border-b border-[#808488] w-full absolute"></div>
            </div>
          )}
        </div>

        {/* Discount */}
        {discountPercentage > 0 && (
          <span className="text-[10px] font-normal font-montserrat text-[#FE735C]">
            {discountPercentage}%Off
          </span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">{renderRating()}</div>
          <span className="text-[10px] font-normal font-montserrat text-[#A4A9B3] ml-1">
            {product.reviewCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
