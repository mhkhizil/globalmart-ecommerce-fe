'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './product-slider.css';

import Image from 'next/image';
import { useRef } from 'react';
import Slider from 'react-slick';

type ProductDetailImage = {
  id: number;
  product_detail_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
};

interface ProductImageSliderProps {
  images: ProductDetailImage[];
  productName: string;
  fallbackImage?: string;
}

function ProductImageSlider({
  images,
  productName,
  fallbackImage,
}: ProductImageSliderProps) {
  const sliderRef = useRef<Slider | null>(null);

  // Fallback for empty product images
  const imageList =
    images && images.length > 0
      ? images
      : fallbackImage
        ? [
            {
              id: 0,
              product_detail_id: 0,
              image_path: fallbackImage,
              created_at: '',
              updated_at: '',
            },
          ]
        : [];

  const settings = {
    dots: imageList.length > 1,
    infinite: imageList.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: imageList.length > 1,
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

  if (imageList.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  // Render a simple image container when there's only one image
  if (imageList.length === 1) {
    return (
      <div className="product-slider-container">
        <div className="relative h-[13.313rem] overflow-hidden rounded-[13px]">
          <Image
            src={imageList[0].image_path}
            alt={`${productName}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={90}
          />
        </div>
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
                src={image.image_path}
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

      {/* Only show navigation buttons if there are multiple images */}
      {imageList.length > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}

export default ProductImageSlider;
