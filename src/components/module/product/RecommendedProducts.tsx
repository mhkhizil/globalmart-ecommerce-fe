'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { memo, useMemo } from 'react';

import { ProductDetail } from '@/core/entity/Product';
import { useGetProductByMerchantId } from '@/lib/hooks/service/product/useGetProductByMerchantId';

import ProductPreviewCard2 from './ProductPreviewCard2';

// Types
interface RecommendedProductsProps {
  product: ProductDetail;
}

// Constants

// Component
const RecommendedProducts = memo(({ product }: RecommendedProductsProps) => {
  const router = useRouter();
  const merchantId = product.m_id?.toString() || '';
  const {
    data: recommendedProductList,
    isLoading,
    error,
  } = useGetProductByMerchantId({
    merchant_id: merchantId,
  });
  const t = useTranslations();
  const DEFAULT_TITLE = t('product.recommendedForYou');
  const SEE_ALL_TEXT = t('product.seeAll');
  const NO_PRODUCTS_MESSAGE = t('product.noSimilarProducts');

  // Memoized product list with fallback
  const products = useMemo(() => {
    return recommendedProductList?.product &&
      Array.isArray(recommendedProductList.product)
      ? recommendedProductList.product
      : [];
  }, [recommendedProductList]);

  // Handle See All button click
  const handleSeeAllClick = () => {
    if (merchantId) {
      router.push(`/application/get-product-by-merchantid/${merchantId}`);
    }
  };

  return (
    <section
      className="flex w-full flex-col gap-4"
      aria-label="Recommended Products"
    >
      {/* Header */}
      <div className="flex w-full items-center justify-between sm:gap-x-8">
        <h2 className="text-gray-900 text-base font-semibold leading-6">
          {DEFAULT_TITLE}
        </h2>
        <button
          onClick={handleSeeAllClick}
          className="text-orange-500 text-sm font-medium leading-5 underline hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="See all recommended products"
        >
          {SEE_ALL_TEXT}
        </button>
      </div>

      {/* Product List */}
      <div className="overflow-x-auto scrollbar-none flex w-[90dvw] md:w-full gap-2 p-2">
        {isLoading ? (
          // Loading State
          <div className="flex w-full items-center justify-center py-4">
            <span className="text-gray-600 text-sm animate-pulse">
              Loading recommendations...
            </span>
          </div>
        ) : error ? (
          // Error State
          <div className="flex w-full items-center justify-center py-4 text-red-500 text-sm">
            Failed to load recommendations
          </div>
        ) : products.length > 0 ? (
          // Product Cards
          products.map((recommendedProduct, index) => (
            <div
              key={recommendedProduct.id || index} // Prefer unique ID over index
              className="flex sm:w-[9.5rem] w-[45dvw] flex-shrink-0"
            >
              <ProductPreviewCard2 product={recommendedProduct} />
            </div>
          ))
        ) : (
          // Empty State
          <div className="flex w-full items-center justify-center mt-8 text-gray-600 text-sm leading-5">
            {NO_PRODUCTS_MESSAGE}
          </div>
        )}
      </div>
    </section>
  );
});

RecommendedProducts.displayName = 'RecommendedProducts';
export default RecommendedProducts;
