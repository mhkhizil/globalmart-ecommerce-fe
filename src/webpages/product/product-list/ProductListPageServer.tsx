import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import ProductListPageClient from './ProductListPageClient';

interface IPageProps {
  categoryId: string;
  shopId: string;
}

function ProductListPageServer(props: IPageProps) {
  return <ProductListPageClient {...props} />;
}

export default function ProductListPageServerWithSuspense(props: IPageProps) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <ProductListPageServer {...props} />
    </Suspense>
  );
}
