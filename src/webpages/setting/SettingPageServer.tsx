import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import SettingPageClient from './SettingPageClient';

function SettingPageServer() {
  return <SettingPageClient />;
}

export default function SettingPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <SettingPageServer />
    </Suspense>
  );
}
