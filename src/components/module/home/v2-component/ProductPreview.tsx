'use client';

import Link from 'next/link';

import { ProductSample2 } from '@/lib/constants/ProductsSample';

import MerchantProductPreviewList from '../../merchant-profile/Merchant-profile-detail/MerchantProductPreviewList';
import ProductPreviewCard2 from '../../product/ProductPreviewCard2';

function ProductPreview() {
  return (
    <div className="flex w-full flex-col mt-[1rem]">
      {/* <div className="flex w-full items-center justify-between px-[1.2rem]">
        <span className="text-[1rem] font-[600] leading-[1.8rem]">
          Feature Products
        </span>
        <Link
          href={'/application/product/list'}
          className="text-[#FE8C00] text-[0.875rem] leading-[1.25rem] font-[500] underline"
        >
          See All
        </Link>
      </div> */}
      <div className="flex w-full space-x-4 px-4 scrollbar-none overflow-x-auto ">
        {/* {ProductSample2.map((product, index) => {
          return (
            <div
              key={index + product.id}
              className="w-[20dvw] sm:w-[80px] flex-shrink-0"
            >
              <ProductPreviewCard2 {...product} />
            </div>
          );
        })}
        {ProductSample2.map((product, index) => {
          return (
            <div
              key={index + product.id}
              className="w-[20dvw] sm:w-[80px] flex-shrink-0"
            >
              <ProductPreviewCard2 {...product} />
            </div>
          );
        })} */}
        <MerchantProductPreviewList />
      </div>
    </div>
  );
}
export default ProductPreview;
