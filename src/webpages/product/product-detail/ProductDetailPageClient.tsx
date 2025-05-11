'use client';

import { Toaster } from 'react-hot-toast';

import ProductDetailInfo from '@/components/module/product/ProductDetailInfo';
import ProductImageSlider from '@/components/module/product/ProductImageSlider';
import { ProductDetail } from '@/core/entity/Product';
import { ProductSample2 } from '@/lib/constants/ProductsSample';

interface IProdcutDetailProps {
  product: ProductDetail;
}

const images = [
  'https://utfs.io/f/4PbNtc78sfabebTNI40IO5hJSdVjPDtZ6LzRoiYyX08lFv2b',
  'https://utfs.io/f/4PbNtc78sfabebTNI40IO5hJSdVjPDtZ6LzRoiYyX08lFv2b',
  'https://utfs.io/f/4PbNtc78sfabebTNI40IO5hJSdVjPDtZ6LzRoiYyX08lFv2b',
];

function ProductDetailPageClient(props: IProdcutDetailProps) {
  const { product } = props;
  return (
    <div className="flex w-full h-[100dvh] flex-col ]">
      <Toaster position="top-center" containerStyle={{}} />
      <ProductImageSlider
        images={product.product_image.map(currentImage => currentImage.link)}
        name={product.p_name}
      />
      <ProductDetailInfo product={product} productPreviews={ProductSample2} />
    </div>
  );
}
export default ProductDetailPageClient;
