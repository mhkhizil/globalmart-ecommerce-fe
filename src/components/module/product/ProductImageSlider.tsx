'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import BackIcon from '@/components/common/icons/BackIcon';
import LikeIcon from '@/components/common/icons/LikeIcon';
// Types
interface ProductImageSliderProps {
  images: string[];
  name: string;
}

// Constants
const FALLBACK_IMAGE = '/food-fallback.png'; // Ensure this exists in /public
const IMAGE_DIMENSIONS = { width: 512, height: 512 } as const;
const SLIDER_HEIGHT = '20.438rem';
const SLIDER_DOT_STYLES = {
  height: '0.25rem',
  width: '2rem',
  bottom: '5.2rem',
} as const;

// Component
const ProductImageSlider = memo(({ images, name }: ProductImageSliderProps) => {
  const sliderRef = useRef<Slider | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageSources, setImageSources] = useState<string[]>(() =>
    Array.isArray(images) && images.length > 0 ? images : [FALLBACK_IMAGE]
  );
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const router = useRouter();
  const t = useTranslations();

  // Slider settings with custom paging
  const sliderSettings: Settings = useMemo(
    () => ({
      dots: true,
      infinite: imageSources.length > 1, // Disable infinite for single image
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dotsClass: 'slick-dots product-slider',
      customPaging: (index: number) => (
        <div
          className="absolute rounded-full bg-gray-300 transition-opacity"
          style={{
            ...SLIDER_DOT_STYLES,
            opacity: index === currentSlide ? 1 : 0.5,
          }}
          aria-label={`Go to slide ${index + 1}`}
        />
      ),
      beforeChange: (_, next) => setCurrentSlide(next),
    }),
    [imageSources.length, currentSlide]
  );

  // Handlers
  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  const handleLikeToggle = useCallback(() => {
    setIsLiked(previous => !previous);
  }, []);

  const handleImageError = useCallback(
    (index: number) => {
      if (!failedImages.has(index)) {
        setFailedImages(previous => {
          const newSet = new Set(previous);
          newSet.add(index);
          return newSet;
        });

        setImageSources(previous => {
          const newSources = [...previous];
          newSources[index] = FALLBACK_IMAGE;
          return newSources;
        });
      }
    },
    [failedImages]
  );

  return (
    <section className="relative w-full overflow-hidden p-2 slider-container flex-shrink-0">
      {/* Header Overlay */}
      <header className="absolute z-10 top-2 left-4 right-4 flex items-center justify-between">
        <button
          onClick={handleBackClick}
          aria-label="Go back"
          className="p-1 rounded-full focus:outline-none focus:ring-0 focus:ring-white"
        >
          <BackIcon
            arrowStrokeColor="white"
            circleBorderColor="white"
            className="h-9 w-9 pointer-events-none"
          />
        </button>
        <h2 className="text-center text-white text-base font-semibold leading-6 flex-1 truncate">
          {t('product.aboutThisMenu')}
        </h2>
        <button
          onClick={handleLikeToggle}
          aria-label={isLiked ? 'Unlike this menu' : 'Like this menu'}
          className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        >
          <LikeIcon
            isLiked={isLiked}
            circleFillerColor="none"
            heartStrokeColor="white"
            heartFillColor={isLiked ? 'white' : 'none'}
            className="h-9 w-9"
          />
        </button>
      </header>

      {/* Slider */}
      <Slider
        ref={sliderRef}
        {...sliderSettings}
        className="w-full relative z-0"
      >
        {imageSources.map((image, index) => (
          <div
            key={`${name}-${index}`}
            className="flex items-center justify-center w-full"
          >
            <Image
              src={image}
              alt={`${name} - Image ${index + 1}`}
              width={IMAGE_DIMENSIONS.width}
              height={IMAGE_DIMENSIONS.height}
              className="w-full h-[20.438rem] rounded-2xl object-cover"
              priority={index === 0} // Preload first image only
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+/ahAQI8A/8BOz8L9gAAAABJRU5ErkJggg=="
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
});

ProductImageSlider.displayName = 'ProductImageSlider';
export default ProductImageSlider;
