// hocs/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '../hooks/session/useSession';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthWrapper(props: P) {
    const router = useRouter();
    const { data: session, isLoading } = useSession();

    useEffect(() => {
      if (!isLoading && !session?.user) {
        router.replace('/login');
      }
    }, [isLoading, session, router]);

    if (isLoading) return <div>{'Loading...'}</div>;
    if (!session?.user) return;

    return <Component {...props} />;
  };
}
