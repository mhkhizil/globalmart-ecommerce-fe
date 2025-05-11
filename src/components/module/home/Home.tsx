'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import ProductScrollLoader from '@/components/common/loader/ProductScrollLoader';
import { AdManager } from '@/components/module/ads/AdManager';
import { useAds } from '@/components/module/ads/useAds';
import { Product, ProductDetail } from '@/core/entity/Product';
import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';
import { useGetPromoList } from '@/lib/hooks/service/promotion/useGetPromoList';
import { useGetAllShops } from '@/lib/hooks/service/shop/useGetAllShops';

import CategoryPreview from './category/CategoryPreview';
import Header from './Header';
import ProductPreview from './ProductPreview';
import Promotion from './promotion/Promotion';
import ShopList from './shops/ShopList';

const handleAdClosed = () => {
  // TODO: Implement ad closed tracking
};

function Home() {
  const t = useTranslations();
  const [menus, setMenus] = useState<ProductDetail[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const scrollableRef = useRef(null);
  const observerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasMoreRef = useRef(hasMore);
  const [error, setError] = useState<string | undefined>();
  const expectedProductPerPage = 4;
  const isLoadingRef = useRef(isLoading);
  const initialFetchDone = useRef(false);

  // Fetch shops data
  const {
    data: shopsData,
    isLoading: isShopsLoading,
    error: shopsError,
  } = useGetAllShops({
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch ads data once at parent level to be more efficient
  const {
    data: adsData,
    isLoading: isAdsLoading,
    error: adsError,
  } = useGetPromoList({ type: 'ads' });

  // Use our ads hook for ad-related functionality
  const { resetShownAds, trackAdClick } = useAds();

  // Reset shown ads on component mount for testing purposes
  useEffect(() => {
    // This ensures the ad shows each time we navigate to this page during testing
    resetShownAds();
  }, [resetShownAds]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (page === 1 && initialFetchDone.current) return;
    if (page === 1) {
      initialFetchDone.current = true;
    }

    const controller = new AbortController();
    const fetchMenu = async () => {
      if (!hasMoreRef.current || isLoadingRef.current) return;

      setIsLoading(true);
      setError(undefined);
      try {
        //TODO: implement fetch login here

        const productService = new ProductService(
          new ProductRepository(new AxiosCustomClient())
        );
        const response = await productService.getAllProduct({
          // category_id: '1,2',
          per_page: expectedProductPerPage,
          page: page,
          // {signal:controller.signal}
        });

        setHasMore(response.product.length >= expectedProductPerPage);
        setMenus(previous => [...previous, ...response.product]);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(error.message);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();

    return () => {
      controller.abort();
    };
  }, [page]);

  useEffect(() => {
    if (typeof globalThis === 'undefined' || !globalThis.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isLoadingRef.current
        ) {
          setPage(previous => previous + 1);
        }
      },
      {
        root: scrollableRef.current,
        threshold: 0.5,
      }
    );
    const target = observerRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
        observer.disconnect();
      }
    };
  }, [isLoading]);

  const handleAdClicked = (adId: string) => {
    trackAdClick(adId);
  };

  return (
    <div className="flex w-full flex-col h-full scrollbar-none overflow-y-auto pb-2">
      {/* Ad Manager Component - Using data fetched at parent level */}
      <AdManager
        delay={2000}
        showOnce={false} // Set to false for testing so we see it every time
        enabled={true} // Explicitly enable
        onAdClicked={handleAdClicked}
        onAdClosed={handleAdClosed}
        displayStrategy="sequential" // Using sequential mode to show ads one after another
        sequentialDelay={500}
        sequentialLoop={false} // Don't loop back to first ad after showing all
        promotionsData={adsData}
        isPromotionsLoading={isAdsLoading}
        promotionsError={adsError}
      />

      <Header />
      <CategoryPreview />

      {/* Shop list section */}
      <ShopList
        shops={shopsData?.shops || []}
        isLoading={isShopsLoading}
        error={shopsError || undefined}
      />

      {/* We can also fetch promotion data here and pass to Promotion component if needed */}
      <Promotion />

      <ProductPreview products={menus} />

      {hasMore && (
        <div
          className="flex w-full justify-center text-center text-black "
          ref={observerRef}
        >
          <ProductScrollLoader color="#FE8C00" size={8} />
        </div>
      )}
    </div>
  );
}
export default Home;
