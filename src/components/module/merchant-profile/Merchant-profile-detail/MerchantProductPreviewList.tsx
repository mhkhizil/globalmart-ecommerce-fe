'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { memo, useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetProductByMerchantId } from '@/lib/hooks/service/product/useGetProductByMerchantId';
import { useSession } from '@/lib/hooks/session/useSession';

import MerchantProductPreviewCard from '../../product/MerchantProductPreviewCard';
// Constants
const SKELETON_COUNT = 2;

// Skeleton component extracted for reusability
const ProductSkeleton = () => (
  <div className="flex w-full flex-col">
    <Skeleton className="h-[7rem] w-full" />
    <Skeleton className="h-2 w-full mt-2" />
    <Skeleton className="h-2 w-full mt-1" />
    <Skeleton className="h-2 w-full mt-1" />
  </div>
);

function MerchantProductPreviewList() {
  const { data: sessionData } = useSession();
  const [merchantId, setMerchantId] = useState<string>('');
  const t = useTranslations();
  const { data: productData, isLoading } = useGetProductByMerchantId(
    { merchant_id: merchantId },
    { enabled: !!merchantId }
  );

  const products = productData?.product || [];
  const hasProducts = products.length > 0;

  useEffect(() => {
    if (sessionData?.user?.merchant_id) {
      setMerchantId(sessionData?.user?.merchant_id.toString());
    }
  }, [sessionData]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full justify-between">
        <h2 className="text-base font-semibold">
          {t('merchantHome.availableProducts')}
        </h2>
        <div className="flex items-center gap-1">
          <Link
            href="/application/merchant-product-list"
            className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1"
          >
            {t('merchantHome.seeAll')} <ChevronRight size={16} />
          </Link>
          <Link
            href="/application/merchant-product-create"
            className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1"
          >
            {t('merchantHome.addNew')} <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="flex w-full justify-between mb-5 gap-x-2">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {!isLoading && hasProducts && (
        <div className="flex w-full overflow-x-auto scrollbar-hide gap-x-2">
          {products.map(product => (
            <div
              className="sm:w-[12dvw] w-[50dvw] flex-shrink-0"
              key={product.id}
            >
              <MerchantProductPreviewCard product={product} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !hasProducts && (
        <div className="flex w-full items-center justify-center my-3 text-gray-400">
          {t('merchantHome.noProductsAvailable')}
        </div>
      )}
    </div>
  );
}

export default memo(MerchantProductPreviewList);
