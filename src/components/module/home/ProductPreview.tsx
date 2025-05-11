'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Product, ProductDetail } from '@/core/entity/Product';
import { ProductSample } from '@/lib/constants/ProductsSample';

import ProductPreviewCard from '../product/ProductPreviewCard';
import ProductPreviewCard2 from '../product/ProductPreviewCard2';
interface InputProps {
  products: ProductDetail[];
}

function ProductPreview(props: InputProps) {
  const t = useTranslations();
  const { products } = props;
  return (
    <div className="flex w-full flex-col mt-1">
      <div className="flex w-full justify-end px-[0.8rem]">
        <Link
          href={'/application/product/list'}
          className="text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[500] underline"
        >
          {t('home.seeAll')}
        </Link>
      </div>
      <div className="grid w-full  grid-cols-2 gap-x-[0.5rem] gap-y-2 px-[0.8rem] mt-[2px]">
        {products.map(product => {
          return (
            <div className="w-full" key={product.id}>
              <ProductPreviewCard2 product={product} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ProductPreview;
