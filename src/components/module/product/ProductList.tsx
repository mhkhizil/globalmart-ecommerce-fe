'use client';

import { useTranslations } from 'next-intl';

import ProductListView from './ProductListView';

interface IPageProps {
  categoryId: string;
  shopId: string;
}

function ProductList(props: IPageProps) {
  const t = useTranslations();

  return (
    <div className="flex h-[92dvh] w-full flex-col">
      <ProductListView {...props} />
    </div>
  );
}
export default ProductList;
