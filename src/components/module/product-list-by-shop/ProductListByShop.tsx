'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import ProductPreviewCard from '@/components/module/product/ProductPreviewCard';
import { ProductDetail } from '@/core/entity/Product';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { useGetShopDetailById } from '@/lib/hooks/service/shop/useGetShopDetailById';
import { RootState } from '@/lib/redux/ReduxStore';
// Constants
const PRODUCTS_PER_PAGE = 10;
const OBSERVER_THRESHOLD = 0.5;
const PRIMARY_COLOR = '#FE8C00';
const PRIMARY_LIGHT = '#FFAD55';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function ProductListByShop() {
  const searchParameter = useSearchParams();
  const shopId = searchParameter?.get('shopId') || '';
  const t = useTranslations('productListByShop');

  // Get current locale
  const locale = useLocale();
  const reduxLocale = useSelector((state: RootState) => state.language.locale);
  const currentLocale = reduxLocale || locale;

  // Refs for infinite scrolling
  const observerRef = useRef<HTMLDivElement>(null);
  const productListRef = useRef<HTMLDivElement>(null);

  // State for product list
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // Fetch shop details
  const { data: shopDetail, isLoading: isShopLoading } = useGetShopDetailById(
    shopId,
    {
      enabled: !!shopId,
    }
  );

  // Get localized address based on current locale
  const getLocalizedAddress = useMemo(() => {
    if (!shopDetail) return '';

    // First try to get the address for the current locale
    let address;

    switch (currentLocale) {
      case 'en': {
        address = shopDetail.en_addr;
        break;
      }
      case 'mm': {
        address = shopDetail.mm_addr;
        break;
      }
      case 'th': {
        address = shopDetail.th_addr;
        break;
      }
      case 'cn': {
        address = shopDetail.cn_addr;
        break;
      }
      default: {
        address = undefined;
      }
    }

    // If address for current locale is not available, fallback to en_addr
    if (!address) {
      address = shopDetail.en_addr;
    }

    // If en_addr is also not available, use the default addr
    return address || shopDetail.addr || '';
  }, [shopDetail, currentLocale]);

  // Initialize product service
  const productService = useMemo(
    () => new ProductService(new ProductRepository(new AxiosCustomClient())),
    []
  );

  // Fetch products function
  const fetchProducts = useCallback(
    async (pageNumber: number) => {
      if (!shopId) return;

      try {
        setIsProductsLoading(true);

        const response = await productService.getProductListByCateogry({
          shop_id: shopId,
          page: pageNumber,
          per_page: PRODUCTS_PER_PAGE,
        });

        setProducts(previous =>
          pageNumber === 1
            ? response.product
            : [...previous, ...response.product]
        );

        setHasMore(response.product.length >= PRODUCTS_PER_PAGE);
      } catch (error_: any) {
        setError(
          error_ instanceof Error ? error_.message : 'Failed to fetch products'
        );
        setHasMore(false);
      } finally {
        setIsProductsLoading(false);
      }
    },
    [shopId, productService]
  );

  // Load next page
  const loadMoreProducts = useCallback(() => {
    if (hasMore && !isProductsLoading) {
      setPage(previousPage => previousPage + 1);
    }
  }, [hasMore, isProductsLoading]);

  // Fetch products when page changes
  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isProductsLoading) {
          loadMoreProducts();
        }
      },
      { root: productListRef.current, threshold: OBSERVER_THRESHOLD }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isProductsLoading, loadMoreProducts]);

  return (
    <div className="h-[92dvh] w-full flex flex-col bg-gray-50">
      {/* Shop Detail Section - Sticky */}
      <AnimatePresence>
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="sticky top-0 z-10 w-full bg-white shadow-md"
        >
          {isShopLoading ? (
            <div className="w-full h-[100px] flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full border-3 animate-spin"
                style={{
                  borderColor: `${PRIMARY_COLOR} transparent ${PRIMARY_COLOR} ${PRIMARY_COLOR}`,
                }}
              ></div>
            </div>
          ) : shopDetail ? (
            <>
              {/* Shop Cover */}
              <div className="relative w-full h-[160px] overflow-hidden bg-gray-100">
                {shopDetail.cover_image ? (
                  <Image
                    src={shopDetail.cover_image}
                    alt={shopDetail.name || 'Shop Banner'}
                    fill
                    sizes="100vw"
                    className="object-contain w-full h-full"
                    priority
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(to right, ${PRIMARY_LIGHT}, ${PRIMARY_COLOR})`,
                    }}
                  ></div>
                )}
              </div>

              {/* Shop Info */}
              <div className="relative px-4 py-2 flex gap-3">
                <div className="absolute -top-8 left-4 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                  {shopDetail.image ? (
                    <Image
                      src={shopDetail.image}
                      alt={shopDetail.name || 'Shop Logo'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-base font-bold">
                      {shopDetail.name?.[0] || 'S'}
                    </div>
                  )}
                </div>

                <div className="ml-16 flex flex-col">
                  <h1 className="text-base font-bold text-gray-800">
                    {shopDetail.name}
                  </h1>
                  {shopDetail.description && (
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {shopDetail.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mt-1">
                    {/* Shop times */}
                    {(shopDetail.opening_time || shopDetail.closing_time) && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          style={{ color: PRIMARY_COLOR }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs">
                          {shopDetail.opening_time && shopDetail.closing_time
                            ? `${shopDetail.opening_time} - ${shopDetail.closing_time}`
                            : shopDetail.opening_time ||
                              shopDetail.closing_time}
                        </span>
                      </div>
                    )}

                    {/* Shop address - using localized address */}
                    {getLocalizedAddress && (
                      <div className="flex items-start gap-1 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mt-0.5 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs">{getLocalizedAddress}</span>
                      </div>
                    )}

                    {/* Shop phone - callable */}
                    {shopDetail.phone && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <a
                          href={`tel:${shopDetail.phone}`}
                          className="text-xs text-primary-600 hover:underline"
                          style={{ color: PRIMARY_COLOR }}
                        >
                          {shopDetail.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full py-4 flex items-center justify-center">
              <p className="text-gray-500">{t('shopNotFound')}</p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* Products Section - Scrollable */}
      <div
        ref={productListRef}
        className="flex-1 overflow-y-auto scrollbar-none"
      >
        <section className="px-4 pb-6 pt-4">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-lg font-semibold mb-4 px-2"
            style={{ color: PRIMARY_COLOR }}
          >
            {t('products')}
          </motion.h2>

          {error && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="w-full py-4 text-center text-red-500"
            >
              {error}
            </motion.div>
          )}

          {products.length === 0 && !isProductsLoading && !error && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="w-full py-8 text-center text-gray-500"
            >
              {t('noProductsAvailable')}
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-3"
          >
            {products.map((product, index) => (
              <motion.div key={`${product.id}-${index}`} variants={fadeInUp}>
                <ProductPreviewCard
                  product={product}
                  className="w-full text-sm"
                />
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <div ref={observerRef} className="flex justify-center py-4 w-full">
              <ProductScrollLoader color={PRIMARY_COLOR} size={8} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductListByShop;
