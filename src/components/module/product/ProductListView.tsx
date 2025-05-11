'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import { ProductDetail } from '@/core/entity/Product';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

import ProductListFilter from './ProductListFilter';
import ProductPreviewCard from './ProductPreviewCard';

// Constants
const PRODUCTS_PER_PAGE = 10;
const OBSERVER_THRESHOLD = 0.5;
const FETCH_DEBOUNCE_MS = 200;

// Types
interface ProductListViewProps {
  categoryId?: string;
  shopId?: string;
}

interface FilterState {
  categoryIds: number[];
  shopIds: number[];
}

interface FetchProductsOptions {
  page: number;
  perPage: number;
  categoryIds?: number[];
  shopIds?: number[];
  signal: AbortSignal;
}

interface UseProductListReturn {
  products: ProductDetail[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | undefined;
  fetchNextPage: () => void;
  refetchWithFilters: (filters: FilterState) => void;
}

// Custom Hook for Product Fetching Logic
const useProductList = (initialFilters: FilterState): UseProductListReturn => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const productService = useMemo(
    () => new ProductService(new ProductRepository(new AxiosCustomClient())),
    []
  );

  const fetchProducts = useCallback(
    async ({
      page,
      perPage,
      categoryIds,
      shopIds,
      signal,
    }: FetchProductsOptions) => {
      try {
        setIsLoading(true);
        setError(undefined);

        const hasFilters = categoryIds?.length || shopIds?.length;
        let response;

        response = await (hasFilters
          ? productService.getProductListByCateogry({
              category_id: categoryIds?.length
                ? categoryIds.join(',')
                : undefined,
              shop_id: shopIds?.length ? shopIds.join(',') : undefined,
              per_page: perPage,
              page,
            })
          : productService.getAllProduct({
              per_page: perPage,
              page,
            }));

        setProducts(previous =>
          page === 1 ? response.product : [...previous, ...response.product]
        );
        setHasMore(response.product.length >= perPage);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(
            error instanceof Error ? error.message : 'Failed to fetch products'
          );
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [productService]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts({
      page,
      perPage: PRODUCTS_PER_PAGE,
      categoryIds: filters.categoryIds,
      shopIds: filters.shopIds,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [page, filters, fetchProducts]);

  const fetchNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(previous => previous + 1);
    }
  }, [hasMore, isLoading]);

  const refetchWithFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    products,
    isLoading,
    hasMore,
    error,
    fetchNextPage,
    refetchWithFilters,
  };
};

// Main Component
const ProductListView: React.FC<ProductListViewProps> = ({
  categoryId,
  shopId,
}) => {
  const router = useRouter();
  const t = useTranslations();
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const initialCategoryIds = useMemo(
    () =>
      categoryId
        ?.split(',')
        .map(id => Number.parseInt(id, 10))
        .filter(Boolean) ?? [],
    [categoryId]
  );

  const initialShopIds = useMemo(
    () =>
      shopId
        ?.split(',')
        .map(id => Number.parseInt(id, 10))
        .filter(Boolean) ?? [],
    [shopId]
  );

  const initialFilters = useMemo(
    () => ({
      categoryIds: initialCategoryIds,
      shopIds: initialShopIds,
    }),
    [initialCategoryIds, initialShopIds]
  );

  const {
    products,
    isLoading,
    hasMore,
    error,
    fetchNextPage,
    refetchWithFilters,
  } = useProductList(initialFilters);

  const handleApplyFilters = useCallback(
    ({ categoryIds, shopIds }: FilterState) => {
      refetchWithFilters({ categoryIds, shopIds });

      const params = new URLSearchParams();

      if (categoryIds.length > 0) {
        params.set('categoryId', categoryIds.join(','));
      }

      if (shopIds.length > 0) {
        params.set('shopId', shopIds.join(','));
      }

      const queryString = params.toString();
      const url =
        '/application/product/list' + (queryString ? `?${queryString}` : '');
      router.replace(url);
    },
    [router, refetchWithFilters]
  );

  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNextPage();
        }
      },
      { root: scrollableRef.current, threshold: OBSERVER_THRESHOLD }
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
      <header className="sticky top-0 z-30 flex px-6 bg-white border-b border-gray-400/50">
        <ProductListFilter
          onApplyFilters={handleApplyFilters}
          defaultCategories={initialCategoryIds}
          defaultShops={initialShopIds}
        />
      </header>

      <section className="pt-4 px-2 flex flex-col w-full gap-y-2">
        <h4 className="mb-4 px-2 text-xl font-semibold">
          {t('product.productList')}
        </h4>

        {products.length === 0 && !isLoading && !error && (
          <span className="flex w-full items-center justify-center text-gray-400">
            {t('product.noProductsAvailable')}
          </span>
        )}

        {error && (
          <span className="flex w-full items-center justify-center text-red-500">
            {error}
          </span>
        )}

        {products.map((product, index) => (
          <ProductPreviewCard
            key={product.id + index}
            product={product}
            className="w-full size-32 text-sm"
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
};

export default ProductListView;
