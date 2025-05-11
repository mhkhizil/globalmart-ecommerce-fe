import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { OrderRepository } from '@/core/repository/OrderRepository';
import { OrderService } from '@/core/services/OrderService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { ProductSample } from '@/lib/constants/ProductsSample';
import UserOrderDetailPageServerWithSuspense from '@/webpages/user-order-detail/UserOrderDetailPageServer';

interface IPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  const t = await getTranslations({
    locale: locale as string,
    namespace: 'application.user_order_detail.metadata',
  });

  // Could fetch order details here to customize the metadata if needed

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function UserOrderDetailPage(props: IPageProps) {
  const { id } = await props.params;
  return <UserOrderDetailPageServerWithSuspense id={id} />;
}

export default UserOrderDetailPage;
