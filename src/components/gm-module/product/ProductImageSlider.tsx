'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './product-slider.css';

import Image from 'next/image';
import { useRef } from 'react';
import Slider from 'react-slick';

type ProductImage = {
  id: number;
  p_id: number;
  link: string;
  type: number;
  created_at: string;
  updated_at: string;
};

interface ProductImageSliderProps {
  images: ProductImage[];
  productName: string;
  fallbackImage?: string;
}

function ProductImageSlider({
  images,
  productName,
  fallbackImage,
}: ProductImageSliderProps) {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    customPaging: function () {
      return <div className="custom-dot"></div>;
    },
    dotsClass: 'slick-dots custom-dots',
  };

  const goPrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // Fallback for empty product images
  const imageList =
    images && images.length > 0
      ? images
      : fallbackImage
        ? [
            {
              id: 0,
              p_id: 0,
              link: fallbackImage,
              type: 1,
              created_at: '',
              updated_at: '',
            },
          ]
        : [];

  if (imageList.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="product-slider-container">
      <Slider ref={sliderRef} {...settings}>
        {imageList.map((image, index) => (
          <div key={image.id || index}>
            <div className="relative h-[13.313rem] overflow-hidden rounded-[13px]">
              <Image
                src={image.link}
                alt={`${productName} - image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
                quality={90}
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation buttons with inline styles for testing */}
      <button
        onClick={goPrevious}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-[inset_-6px_-6px_4px_0px_rgba(196,196,196,1),inset_6px_6px_4px_0px_rgba(222,219,219,1)]`}
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
      <button
        onClick={goNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-[inset_-6px_-6px_4px_0px_rgba(196,196,196,1),inset_6px_6px_4px_0px_rgba(222,219,219,1)]`}
        aria-label="Next slide"
      >
        <div className="rotate-0">
          <Image
            src="/images/carousel-arrow-fill.svg"
            alt="Previous"
            width={8}
            height={8}
          />
        </div>
      </button>
    </div>
  );
}

export default ProductImageSlider;
