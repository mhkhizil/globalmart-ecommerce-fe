'use client';

import { ProductDetail } from '@/core/entity/Product';

import ProductImageSlider from './ProductImageSlider';

interface ProductDetailProps {
  product: ProductDetail;
}

function ProductDetailInfo({ product }: ProductDetailProps) {
  return (
    <div className="flex flex-col">
      <div className="relative w-full">
        <ProductImageSlider
          images={product.product_image}
          productName={product.p_name}
          fallbackImage={product.p_image}
        />
      </div>
      <div>{/*product info*/}</div>
      <div>{/*others*/}</div>
    </div>
  );
}
export default ProductDetailInfo;
