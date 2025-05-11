import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import OtpPageClient from './OtpPageClient';

interface IOptPageProps {
  email: string;
}

function OtpPageServer(props: IOptPageProps) {
  return <OtpPageClient {...props} />;
}

export default async function OtpPageServerWithSuspense(props: IOptPageProps) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <OtpPageServer {...props} />
    </Suspense>
  );
}
