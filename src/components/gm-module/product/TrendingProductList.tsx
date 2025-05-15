'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import ProductCard from '@/components/gm-module/product/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductDetail } from '@/core/entity/Product';
import { useGetProductList } from '@/lib/hooks/service/product/useGetProductList';
import { Locale } from '@/lib/redux/slices/LanguageSlice';

interface ProductPreviewListProps {
  title?: string;
  categoryId?: string;
}

function TrendingProductList({ title, categoryId }: ProductPreviewListProps) {
  // Get the current locale from Redux
  const locale = useSelector(
    (state: { language: { locale: Locale } }) => state.language.locale
  );

  // Track scroll position and limits
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Set up embla carousel with wheel/touchpad scrolling - disable loop
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false, // Disable loop to prevent repeating from start
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  // Update scroll state when the carousel changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrevious(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    // Call once and then listen for changes
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  // Enable wheel scrolling with reduced sensitivity
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !emblaApi) return;

    const handleWheel = (event: WheelEvent) => {
      // Prevent the default scroll behavior
      event.preventDefault();

      // Apply throttling to reduce sensitivity
      // Only scroll once per 250ms to avoid rapid scrolling
      if (wheelThrottleTimeout.current) return;

      wheelThrottleTimeout.current = setTimeout(() => {
        wheelThrottleTimeout.current = null;
      }, 250);

      // Determine direction
      const direction =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? Math.sign(event.deltaX)
          : Math.sign(event.deltaY);

      // Use scrollNext or scrollPrev based on direction
      if (direction > 0 && canScrollNext) {
        emblaApi.scrollNext();
      } else if (direction < 0 && canScrollPrevious) {
        emblaApi.scrollPrev();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [emblaApi, canScrollNext, canScrollPrevious]);

  // Used for throttling wheel scrolling
  const wheelThrottleTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    data: productList,
    isLoading,
    error,
  } = useGetProductList({
    page: 1,
    per_page: 10,
    category_id: categoryId,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-[180px] h-[320px] bg-gray-200 rounded-md animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !productList) {
    return <div>Failed to load products</div>;
  }

  // If there are no products, don't render the component
  if (productList.product.length === 0) {
    return null;
  }

  // Get description based on locale and prepare products
  const getLocalizedProducts = () => {
    return productList.product.map((item: ProductDetail) => {
      // Create a copy of the item to avoid mutation
      let localizedItem = { ...item };

      // Update the description based on locale
      if (locale === 'cn' && item.cn_description) {
        localizedItem.en_description = item.cn_description;
      } else if (locale === 'mm' && item.mm_description) {
        localizedItem.en_description = item.mm_description;
      } else if (locale === 'th' && item.th_description) {
        localizedItem.en_description = item.th_description;
      }

      return localizedItem;
    });
  };

  // Get products with localized descriptions
  const localizedProducts = getLocalizedProducts();

  // Custom navigation buttons matching Figma design
  const CustomPreviousButton = () => (
    <button
      onClick={() => emblaApi?.scrollPrev()}
      disabled={!canScrollPrevious}
      className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-[inset_-6px_-6px_4px_0px_rgba(196,196,196,1),inset_6px_6px_4px_0px_rgba(222,219,219,1)] ${canScrollPrevious ? '' : 'opacity-50 cursor-not-allowed'}`}
      aria-label="Previous slide"
    >
      <div className="rotate-180">
        <Image
          src="/images/carousel-arrow-fill.svg"
          alt="Previous"
          width={8}
          height={8}
        />
      </div>
    </button>
  );

  const CustomNextButton = () => (
    <button
      onClick={() => emblaApi?.scrollNext()}
      disabled={!canScrollNext}
      className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-[inset_-6px_-6px_4px_0px_rgba(196,196,196,1),inset_6px_6px_4px_0px_rgba(222,219,219,1)] ${canScrollNext ? '' : 'opacity-50 cursor-not-allowed'}`}
      aria-label="Next slide"
    >
      <Image
        src="/images/carousel-arrow-fill.svg"
        alt="Next"
        width={8}
        height={8}
      />
    </button>
  );

  return (
    <div className="w-full py-4">
      {title && (
        <h2 className="text-xl font-semibold font-['Montserrat'] mb-4">
          {title}
        </h2>
      )}

      <div className="relative" ref={containerRef}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {localizedProducts.map((product: ProductDetail) => (
              <div
                key={product.id}
                className="flex-[0_0_auto] min-h-[300px] min-w-0 px-1.5 first:pl-4 last:pr-4"
              >
                <ProductCard product={product} showRating={false} />
              </div>
            ))}
          </div>
        </div>

        <CustomPreviousButton />
        <CustomNextButton />
      </div>
    </div>
  );
}

export default TrendingProductList;
