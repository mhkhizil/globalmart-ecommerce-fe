import { getIronSession } from 'iron-session';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';
import ProductListByShopPageServerWithSuspense from '@/webpages/product-list-by-shop/ProductListByShopPageServer';

interface ProductListByShopPageProps {
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
    namespace: 'application.product_list_by_shop.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ProductListByShopPage({ params }: ProductListByShopPageProps) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (session.user?.user?.roles === 2) {
    redirect('/application/merchant-ProductListByShop');
  }
  return <ProductListByShopPageServerWithSuspense />;
}

export default ProductListByShopPage;
