'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import Slider from 'react-slick';

import RightArrow from '@/components/common/icons/RightArrow';

interface OnboardingPageSliderProps {
  onSlideChange?: (index: number) => void;
}

function OnboardingPageSlider({ onSlideChange }: OnboardingPageSliderProps) {
  const sliderRef = useRef(null);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    customPaging: function (index: any) {
      return (
        <div className="h-[5px] w-[20px] rounded-[100px] custom-dots"></div>
      );
    },
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: 'slick-dots custom-dots',
    arrows: false,
    beforeChange: (_: any, next: number) => {
      setCurrentSlide(next);
      onSlideChange?.(next);
    },
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Helper function to handle navigation with locale
  const navigateTo = (path: string) => {
    try {
      router.push(`/${locale}${path}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback
      globalThis.location.href = `/${locale}${path}`;
    }
  };

  return (
    <div className="w-full max-w-[95%] mx-auto relative bg-black/25 backdrop-blur-sm h-auto rounded-[20px] pt-[0.25rem] pb-[2.25rem] overflow-visible border border-white/15">
      {/* Glass effect blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[10%] rounded-full bg-white opacity-5"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[5%] rounded-full bg-white opacity-5"></div>
      </div>

      <div className="slider-container w-full relative z-10">
        <Slider ref={sliderRef} {...settings} className="text-red-800">
          <div></div>
          <div></div>
          <div></div>
        </Slider>
      </div>

      <div className="flex w-full absolute bottom-0 left-0 right-0 px-4 py-3 items-center justify-between z-20">
        <button
          onClick={() => {
            if (
              sliderRef.current &&
              (sliderRef.current as any).innerSlider.state.currentSlide > 0
            ) {
              (sliderRef.current as any).slickPrev();
            } else {
              navigateTo('/onboarding');
            }
          }}
          disabled={currentSlide === 0}
          className={`flex items-center justify-center gap-x-[6px] py-3 text-red-500 hover:text-white transition-colors px-4 rounded-full min-w-[80px] ${
            currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>

        <button
          onClick={() => {
            if (
              sliderRef.current &&
              (sliderRef.current as any).innerSlider.state.currentSlide < 2
            ) {
              (sliderRef.current as any).slickNext();
            } else {
              navigateTo('/login');
            }
          }}
          className="flex items-center justify-center gap-x-[6px] py-3 text-red-500 hover:text-white transition-colors px-4 rounded-full min-w-[80px]"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OnboardingPageSlider;
