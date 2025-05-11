import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import SearchPageClient from './SearchPageClient';

function SearchPageServer() {
  return <SearchPageClient />;
}

export default function SearchPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <SearchPageServer />
    </Suspense>
  );
}
