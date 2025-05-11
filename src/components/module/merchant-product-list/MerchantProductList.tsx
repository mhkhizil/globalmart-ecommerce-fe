'use client';

import { UseQueryOptions } from '@tanstack/react-query';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import ProductPreviewCard from '@/components/module/product/ProductPreviewCard';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductDetail } from '@/core/entity/Product';
import { useGetProductByMerchantId } from '@/lib/hooks/service/product/useGetProductByMerchantId';
import { useSession } from '@/lib/hooks/session/useSession';

// Constants
const ITEMS_PER_PAGE = 10;
const OBSERVER_THRESHOLD = 0.5;

// Types
interface UseMerchantProductsReturn {
  products: ProductDetail[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | undefined;
  fetchNextPage: () => void;
}

// Custom hook for merchant product fetching logic
const useMerchantProducts = (
  merchantId?: string
): UseMerchantProductsReturn => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Keep track of the accumulated products
  const accumulatedProductsRef = useRef<ProductDetail[]>([]);

  const productService = useMemo(
    () => new ProductService(new ProductRepository(new AxiosCustomClient())),
    []
  );

  // Fetch products for the current page
  const fetchProducts = useCallback(async () => {
    if (!merchantId) return;

    setIsLoading(true);

    try {
      const response = await productService.getProductListByMerchantId({
        merchant_id: merchantId,
        per_page: ITEMS_PER_PAGE,
        page,
      });

      // Accumulate products
      //   if (page === 1) {
      //     accumulatedProductsRef.current = response.product;
      //   } else {
      //     accumulatedProductsRef.current = [
      //       ...accumulatedProductsRef.current,
      //       ...response.product,
      //     ];
      //   }
      setProducts(previous =>
        page === 1 ? response.product : [...previous, ...response.product]
      );

      // Update state with accumulated products
      //setProducts(accumulatedProductsRef.current);
      setHasMore(response.product.length === ITEMS_PER_PAGE);
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Failed to fetch products'
      );
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [merchantId, page, productService]);

  // Reset state when merchant changes
  useEffect(() => {
    if (merchantId) {
      setProducts([]);
      accumulatedProductsRef.current = [];
      setPage(1);
      setHasMore(true);
      setError(undefined);
    }
  }, [merchantId]);

  // Fetch products when page changes or merchant changes
  useEffect(() => {
    if (merchantId) {
      fetchProducts();
    }
  }, [merchantId, page, fetchProducts]);

  // Fetch next page
  const fetchNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(previous => previous + 1);
    }
  }, [hasMore, isLoading]);

  return {
    products,
    isLoading,
    hasMore,
    error,
    fetchNextPage,
  };
};

// Import necessary dependencies for the custom hook
import { useTranslations } from 'next-intl';

import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

import MerchantProductPreveiwListCard from '../product/MerchantProductPreveiwListCard';

function MerchantProductList() {
  const { data: session } = useSession();
  const merchantId = session?.user?.merchant_id;
  const t = useTranslations();
  // Refs for infinite scrolling
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Use our custom hook
  const { products, isLoading, hasMore, error, fetchNextPage } =
    useMerchantProducts(merchantId);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNextPage();
        }
      },
      {
        root: scrollableRef.current,
        threshold: OBSERVER_THRESHOLD,
      }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoading, fetchNextPage]);

  return (
    <div
      ref={scrollableRef}
      className="h-[92dvh] w-full overflow-y-auto scrollbar-none relative"
    >
      <header className="sticky top-0 z-10 bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {t('merchantProductList.yourProducts')}
        </h1>
        <p className="text-gray-500 text-sm">
          {t('merchantProductList.manageYourProductInventory')}
        </p>
      </header>

      <section className="pt-4 px-4 flex flex-col w-full gap-y-4">
        {products.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Image
              src="/food-fallback.png"
              alt="No products"
              width={120}
              height={120}
              className="opacity-50 mb-4"
            />
            <span>{t('merchantProductList.noProductsAvailable')}</span>
            <span className="text-sm mt-2">
              {t('merchantProductList.addProductsToGetStarted')}
            </span>
          </div>
        )}

        {error && (
          <div className="flex w-full items-center justify-center text-red-500 py-4">
            {error}
          </div>
        )}

        {products.map((product, index) => (
          <MerchantProductPreveiwListCard
            key={`${product.id}-${index}`}
            product={product}
            className="w-full shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          />
        ))}
        {hasMore && (
          <div ref={observerRef} className="flex w-full justify-center mb-2">
            <ProductScrollLoader color="#FE8C00" size={8} />
          </div>
        )}
      </section>
    </div>
  );
}

export default MerchantProductList;
