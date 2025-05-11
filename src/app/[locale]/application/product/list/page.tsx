import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ProductListPageServerWithSuspense from '@/webpages/product/product-list/ProductListPageServer';

interface IPageProps {
  searchParams: Promise<{
    categoryId: string;
    shopId: string;
  }>;
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
    namespace: 'application.product_list.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ProductListPage(props: IPageProps) {
  const { categoryId, shopId } = await props.searchParams;
  return (
    <ProductListPageServerWithSuspense
      categoryId={categoryId}
      shopId={shopId}
    />
  );
}

export default ProductListPage;
