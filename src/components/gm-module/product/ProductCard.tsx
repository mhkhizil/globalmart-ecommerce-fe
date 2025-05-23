import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Product } from '@/core/entity/Product';

type ProductCardProps = {
  product: Product;
  showRating?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showRating = true,
}) => {
  const variant = product.first_product_detail;

  // Check if there's a discount with proper existence and null/undefined handling
  const hasDiscount =
    variant?.discount_type &&
    variant?.discount_type !== null &&
    (variant?.discount_type === 'percentage'
      ? variant?.discount_percent !== null &&
        variant?.discount_percent !== undefined &&
        Number(variant?.discount_percent) > 0
      : variant?.discount_amount !== null &&
        variant?.discount_amount !== undefined &&
        Number(variant?.discount_amount) > 0);

  // Calculate the discounted price with safe property access
  const discountedPrice =
    hasDiscount && variant?.discount_type
      ? variant?.discount_type === 'percentage'
        ? Math.max(
            0,
            Math.round(
              Number(variant.price) -
                Number(variant.price) *
                  (Number(variant?.discount_percent || 0) / 100)
            )
          )
        : Math.max(
            0,
            Math.round(
              Number(variant.price) - Number(variant?.discount_amount || 0)
            )
          )
      : Number(variant.price);

  // Calculate discount percentage with safe property access
  const discountPercentage =
    hasDiscount && variant?.discount_type
      ? variant?.discount_type === 'percentage'
        ? Number(variant?.discount_percent || 0)
        : variant?.discount_amount && Number(variant.price) > 0
          ? Math.round(
              (Number(variant?.discount_amount) / Number(variant.price)) * 100
            )
          : 0
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
  const router = useRouter();

  // Get product image with priority: main product image, variant main image, variant detail images
  const productImage =
    product.p_image ||
    variant.p_image ||
    (variant.product_detail_image && variant.product_detail_image.length > 0
      ? variant.product_detail_image[0].image_path
      : '');

  return (
    <div
      className="flex flex-col flex-1 h-full w-[180px] bg-white rounded-[6px] shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
      onClick={() => {
        router.push(`/application/product/detail/${product.id}`);
      }}
    >
      {/* Product Image */}
      <div className="relative h-[180px] w-full overflow-hidden rounded-t-[4px]">
        <Image
          src={productImage}
          alt={product.product_name}
          fill
          className="object-cover"
          sizes="180px"
          priority
        />
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col gap-1">
        {/* Title */}
        <h3 className="text-sm font-medium font-['Montserrat'] line-clamp-1 text-black">
          {product.product_name}
        </h3>

        {/* Description */}
        <p className="text-[10px] font-normal font-['Montserrat'] leading-[1.6em] text-black line-clamp-2 h-8">
          {product.en_description || ''}
        </p>

        {/* Price Section - only manage the promotion area height */}
        <div className="mt-1 flex flex-col">
          {/* Current Price */}
          <div className="flex items-baseline">
            <span className="text-sm font-semibold text-black">
              ₹{discountedPrice}
            </span>
          </div>

          {/* Use a fixed height container for promo info to ensure consistent height */}
          <div className="">
            {hasDiscount && (
              <div className="flex gap-x-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 line-through">
                    ₹{Number(variant.price)}
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

        {/* Rating - conditionally render based on showRating prop */}
        {showRating && (
          <div className="flex items-center gap-1 ">
            <div className="flex">{renderRating()}</div>
            <span className="text-[10px] font-normal font-['Montserrat'] text-[#A4A9B3] ml-1">
              {Math.floor(Math.random() * 10_000)}{' '}
              {/* Random review count for demo */}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
