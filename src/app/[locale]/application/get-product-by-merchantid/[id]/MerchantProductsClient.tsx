'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductDetail } from '@/core/entity/Product';
import { useGetProductByMerchantId } from '@/lib/hooks/service/product/useGetProductByMerchantId';

import MerchantProductCard from './MerchantProductCard';

// Constants
const PRODUCTS_PER_PAGE = 10;
const OBSERVER_THRESHOLD = 0.5;

interface MerchantProductsClientProps {
  merchantId: string;
}

// Custom hook for product list with infinite scrolling
function useMerchantProducts(merchantId: string) {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [allProducts, setAllProducts] = useState<ProductDetail[]>([]); // Store all products for filtering
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const t = useTranslations('application.get_product_by_merchantid');

  // Create filter params
  const filterParams: ProductFilterByMerchantDto = {
    merchant_id: merchantId,
    page: page,
    per_page: PRODUCTS_PER_PAGE,
  };

  // Fetch products using the hook
  const { data, isLoading, error, refetch } =
    useGetProductByMerchantId(filterParams);

  // Function to apply search filter
  const applySearchFilter = useCallback(
    (productsToFilter: ProductDetail[], query: string) => {
      if (!query) return productsToFilter;

      return productsToFilter.filter(
        product =>
          product.p_name.toLowerCase().includes(query.toLowerCase()) ||
          product.shop_name?.toLowerCase().includes(query.toLowerCase()) ||
          product.c_name.toLowerCase().includes(query.toLowerCase())
      );
    },
    []
  );

  // Update products when data changes
  useEffect(() => {
    if (data?.product) {
      if (page === 1) {
        setProducts(data.product);
        setAllProducts(data.product);
      } else {
        setAllProducts(previousAllProducts => {
          // Create a new array with previous products plus new ones
          const newAllProducts = [...previousAllProducts, ...data.product];

          // Update the filtered products if we're searching
          if (isSearching && searchQuery) {
            const filteredProducts = applySearchFilter(
              newAllProducts,
              searchQuery
            );
            setProducts(filteredProducts);
          } else {
            setProducts(newAllProducts);
          }

          return newAllProducts;
        });
      }
      // Check if there might be more products to load
      setHasMore(data.product.length >= PRODUCTS_PER_PAGE);
    }
  }, [data, page, isSearching, searchQuery, applySearchFilter]); // No need to include allProducts here as we use the functional update pattern

  // Search functionality - separate from the data effect
  useEffect(() => {
    if (allProducts.length === 0) return; // Skip if no products loaded yet

    if (searchQuery) {
      setIsSearching(true);
      // Filter from allProducts instead of products
      const filtered = applySearchFilter(allProducts, searchQuery);
      setProducts(filtered);
      setHasMore(false);
    } else if (isSearching) {
      // Reset search
      setIsSearching(false);
      setProducts(allProducts);
      setHasMore(true);
    }
  }, [searchQuery, allProducts, isSearching, applySearchFilter]);

  // Function to load next page
  const loadNextPage = useCallback(() => {
    if (!isLoading && hasMore && !isSearching) {
      setPage(previous => previous + 1);
    }
  }, [isLoading, hasMore, isSearching]);

  // Function to handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    products,
    isLoading,
    error,
    hasMore,
    loadNextPage,
    handleSearch,
    searchQuery,
  };
}

export default function MerchantProductsClient({
  merchantId,
}: MerchantProductsClientProps) {
  const router = useRouter();
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('application.get_product_by_merchantid');

  const {
    products,
    isLoading,
    error,
    hasMore,
    loadNextPage,
    handleSearch,
    searchQuery,
  } = useMerchantProducts(merchantId);

  // Setup Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadNextPage();
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
  }, [hasMore, isLoading, loadNextPage]);

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="flex flex-col h-[100vh] bg-gradient-to-br from-orange-50 to-white">
      {/* Header Section */}
      <header className="sticky top-0 z-30 bg-white shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </Button>

          <h1 className="text-xl font-semibold text-gray-800">{t('title')}</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full py-2 pl-10 pr-4 rounded-xl border-gray-300 focus:border-orange-400 focus:ring-orange-400"
            value={searchQuery}
            onChange={event => handleSearch(event.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={scrollableRef}
        className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none"
      >
        {error ? (
          <div className="flex flex-col items-center justify-center h-40 text-red-500">
            <p className="text-lg font-medium">{t('failedToLoadProducts')}</p>
            <p className="text-sm mt-2">{error.message}</p>
            <Button
              onClick={() => globalThis.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {t('retry')}
            </Button>
          </div>
        ) : (
          <>
            {products.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p className="text-lg font-medium">{t('noProductsFound')}</p>
                <p className="text-sm mt-2">
                  {searchQuery
                    ? t('tryDifferentSearchTerm')
                    : t('noProductsYet')}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-4"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={`${product.id}-${index}`}
                      variants={itemVariants}
                      layout
                    >
                      <MerchantProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div
                ref={observerRef}
                className="flex w-full justify-center py-6"
              >
                <ProductScrollLoader color="#FE8C00" size={8} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
