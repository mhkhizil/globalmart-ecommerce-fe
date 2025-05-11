import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import OnboardingPageClient from './OnboardingPageClient';

function OnboardingPageServer() {
  return <OnboardingPageClient />;
}

export default function OnboardingPageServerWithSuspense() {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <OnboardingPageServer />
    </Suspense>
  );
}
