import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ProductDetail } from '@/core/entity/Product';

type ProductCardProps = {
  product: ProductDetail;
  showRating?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showRating = true,
}) => {
  // Check if there's a discount
  const hasDiscount =
    product.discount_type &&
    (product.discount_type === 'percentage'
      ? product.discount_percent > 0
      : Number(product.discount_amount) > 0);

  // Calculate the discounted price
  const discountedPrice = hasDiscount
    ? product.discount_type === 'percentage'
      ? Math.round(
          product.p_price - product.p_price * (product.discount_percent / 100)
        )
      : Math.round(product.p_price - Number(product.discount_amount))
    : product.p_price;

  const discountPercentage = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.discount_percent
      : Math.round((Number(product.discount_amount) / product.p_price) * 100)
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

  // Get product image from either p_image or product_image array
  const productImage =
    product.p_image ||
    (product.product_image && product.product_image.length > 0
      ? product.product_image[0].link
      : '');

  return (
    <div
      className="flex flex-col flex-1 h-full w-[180px] bg-white rounded-[6px] shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
      onClick={() => {
        router.push(`/application/product/detail/${product.p_id}`);
      }}
    >
      {/* Product Image */}
      <div className="relative h-[180px] w-full overflow-hidden rounded-t-[4px]">
        <Image
          src={productImage}
          alt={product.p_name}
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
          {product.p_name}
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
                    ₹{product.p_price}
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
