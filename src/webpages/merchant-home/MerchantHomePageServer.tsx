import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantHomePageClient from './MerchantHomePageClient';

interface IPageProps {
  merchant_id: number;
}

function MerchantHomePageServer(props: IPageProps) {
  return <MerchantHomePageClient {...props} />;
}

export default function MerchantHomePageServerWithSuspense(props: IPageProps) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantHomePageServer {...props} />
    </Suspense>
  );
}
