import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import ProductDetailPageServerWithSuspense from '@/webpages/product/product-detail/ProductDetailPageServer';

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
    namespace: 'application.product_detail.metadata',
  });

  // We'll use the default metadata without trying to use the product details
  // to avoid potential type errors
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}

async function ProductDetailPage(props: IPageProps) {
  const { id } = await props.params;
  const productService = new ProductService(
    new ProductRepository(new AxiosCustomClient())
  );
  const product = await productService.getProductById(id);
  // const product = ProductSample.find(product => product.id === id);

  if (!product) {
    return;
  }
  return <ProductDetailPageServerWithSuspense product={product.product} />;
}

export default ProductDetailPage;
