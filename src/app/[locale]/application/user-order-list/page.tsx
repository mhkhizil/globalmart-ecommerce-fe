import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import UserOrderListPageServerWithSuspense from '@/webpages/user-order-list/UserOrderListPageServer';

interface UserOrderListPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.user_order_list.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

function UserOrderListPage({ params }: UserOrderListPageProps) {
  return <UserOrderListPageServerWithSuspense />;
}

export default UserOrderListPage;
