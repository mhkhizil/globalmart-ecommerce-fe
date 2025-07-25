'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './promotion-slider.css';

import Image from 'next/image';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';

import { useGetPromoList } from '@/lib/hooks/service/promotion/useGetPromoList';
import { RootState } from '@/lib/redux/ReduxStore';

import PromotionCard, { PromotionCardProps } from './PromotionCard';

function PromotionList() {
  const sliderRef = useRef<Slider | null>(null);
  const { locale } = useSelector((state: RootState) => state.language);
  const {
    data: promotionListData,
    isLoading,
    error,
  } = useGetPromoList({
    type: 'promo',
  });

  // Early return if no data available
  if (
    isLoading ||
    error ||
    !promotionListData?.promotion ||
    !Array.isArray(promotionListData.promotion) ||
    promotionListData.promotion.length <= 0
  ) {
    return null;
  }

  // Transform API data to promotion cards
  const promotions: PromotionCardProps[] = promotionListData.promotion.map(
    promo => {
      // Get description based on current locale
      let description = promo.en_description; // Default to English

      // Select description based on locale
      if (locale === 'cn' && promo.cn_description) {
        description = promo.cn_description;
      } else if (locale === 'mm' && promo.mm_description) {
        description = promo.mm_description;
      } else if (locale === 'th' && promo.th_description) {
        description = promo.th_description;
      }

      return {
        id: promo.id,
        title: promo.name,
        subtitle: description,
        text: 'All colours',
        image: promo.image,
        link: '#',
      };
    }
  );

  // Additional safety check after transformation
  if (promotions.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
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

  return (
    <div className="relative w-full mb-4">
      <div className="promotion-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {promotions.map(promo => (
            <div key={promo.id} className="px-2">
              <PromotionCard {...promo} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Custom Navigation buttons removed as requested */}
    </div>
  );
}

export default PromotionList;
