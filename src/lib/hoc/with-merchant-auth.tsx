// hocs/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';

import { useSession } from '../hooks/session/useSession';

export function withMerchantAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapper(props: P) {
    const router = useRouter();
    const { data: session, isLoading } = useSession();

    useEffect(() => {
      if (!isLoading && (!session?.user || session?.user?.roles !== 2)) {
        router.replace('/login');
      }
    }, [isLoading, session, router]);

    if (isLoading)
      return (
        <>
          <FallBackLoading />
        </>
      );
    if (!session?.user) return;

    return <Component {...props} />;
  };
}
