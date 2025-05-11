import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import CategoryListPageClient from './CategoryListPageClient';

function CategoryListPageServer() {
  return <CategoryListPageClient />;
}

export default function CategoryListPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <CategoryListPageServer />
    </Suspense>
  );
}
