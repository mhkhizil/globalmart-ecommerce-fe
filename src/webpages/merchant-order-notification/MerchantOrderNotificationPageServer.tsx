import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import MerchantOrderNotificationPageClient from './MerchantOrderNotficationPageClient';

function MerchantOrderNotificationPageServer() {
  return <MerchantOrderNotificationPageClient />;
}

export default function MerchantOrderNotificationPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantOrderNotificationPageServer />
    </Suspense>
  );
}
