import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CartPageServerWithSuspense from '@/webpages/cart/CartPageServer';

interface CartPageProps {
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
    namespace: 'application.cart.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function CartPage({ params }: CartPageProps) {
  return <CartPageServerWithSuspense />;
}

export default CartPage;
