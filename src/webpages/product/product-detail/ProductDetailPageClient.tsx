'use client';

import { Toaster } from 'react-hot-toast';

import ProductDetailInfo from '@/components/gm-module/product/ProductDetailInfo';
import { MainProductDetail } from '@/core/entity/Product';

interface IProdcutDetailProps {
  product: MainProductDetail;
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
      <ProductDetailInfo product={product} />
    </div>
  );
}
export default ProductDetailPageClient;
