import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';

import MerchantOrderListPageClient from './MerchantOrderListPageClient';

interface IPageProps {
  categoryId: number;
  status: number;
}

async function MerchantOrderListPageServer(props: IPageProps) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return (
    <MerchantOrderListPageClient
      {...props}
      userId={session?.user?.user.merchant_id}
    />
  );
}

export default function MerchantOrderListPageServerWithSuspense(
  props: IPageProps
) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <MerchantOrderListPageServer {...props} />
    </Suspense>
  );
}
