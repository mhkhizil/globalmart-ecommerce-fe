'use client';

import { useState } from 'react';

import { ProductDetail } from '@/core/entity/Product';

import ProductImageSlider from './ProductImageSlider';

interface ProductDetailProps {
  product: ProductDetail;
}

function ProductDetailInfo({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('7UK');

  const sizes = ['6 UK', '7 UK', '8 UK', '9 UK', '10 UK'];

  return (
    <div className="flex flex-col px-4">
      <div className="relative w-full">
        <ProductImageSlider
          images={product.product_image}
          productName={product.p_name}
          fallbackImage={product.p_image}
        />
      </div>
      <div className="mt-1 ">
        <div className="mb-2">
          <h3 className="text-[14px] font-['Montserrat'] font-bold">
            Size: {selectedSize}
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size.replace(' ', ''))}
              className={`
                min-w-[4.3rem] py-2 px-4 rounded-md font-semibold text-sm
                ${
                  selectedSize === size.replace(' ', '')
                    ? 'bg-[#FA7189] text-white'
                    : 'bg-white text-[#FA7189] border border-[#FA7189]'
                }
                transition-colors duration-200
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>{/*product info*/}</div>
      <div>{/*others*/}</div>
    </div>
  );
}
export default ProductDetailInfo;
