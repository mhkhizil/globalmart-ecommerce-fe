import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { Product, ProductDetail } from '@/core/entity/Product';

import ProductDetailPageClient from './ProductDetailPageClient';

interface IProdcutDetailProps {
  product: ProductDetail;
}

function ProductDetailPageServer(props: IProdcutDetailProps) {
  return <ProductDetailPageClient {...props} />;
}

export default function ProductDetailPageServerWithSuspense(
  props: IProdcutDetailProps
) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <ProductDetailPageServer {...props} />
    </Suspense>
  );
}
