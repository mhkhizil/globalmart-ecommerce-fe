'use client';

import './promotion-slider.css'; // Import custom CSS

import { useRef } from 'react';
import Slider from 'react-slick';

import { PromotionListResponseDto } from '@/core/dtos/promotion/PromotionListResponseDto';

import PromotionCard from './PromotionCard';

interface PromotionListProps {
  promotions: PromotionListResponseDto['promotion'];
  isLoading?: boolean;
  error?: Error | null;
}

const defaultSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  pauseOnHover: true,
  adaptiveHeight: false,
  dotsClass: 'slick-dots custom-dots',
  customPaging: function (index: number) {
    return <div className="dot-indicator" />;
  },
};

function PromotionList({ promotions, isLoading, error }: PromotionListProps) {
  const sliderRef = useRef(null);

  // If loading, show a simple loading indicator
  if (isLoading) {
    return (
      <div className="w-full h-[10rem] flex items-center justify-center rounded-[5px] bg-gray-100 animate-pulse">
        <div className="text-gray-400">Loading promotions...</div>
      </div>
    );
  }

  // If error or no data, show fallback UI
  if (error || !promotions || promotions.length <= 0) {
    return (
      <div className="w-full h-[10rem] flex items-center justify-center rounded-[5px] bg-gray-100">
        <div className="text-gray-500">
          No promotions available at the moment
        </div>
      </div>
    );
  }

  // Adjust settings based on number of promotions
  const sliderSettings = {
    ...defaultSettings,
    // Disable unnecessary features when there's only one promotion
    dots: promotions.length > 1,
    infinite: promotions.length > 1,
    autoplay: promotions.length > 1,
  };

  return (
    <div className="w-full slider-container overflow-hidden rounded-[5px]">
      <div className="slider-fix relative h-[10rem]">
        {promotions.length === 1 ? (
          // Render a single promotion card directly without slider if there's only one
          <PromotionCard
            imageUrl={promotions[0].image}
            name={promotions[0].name}
            description={promotions[0].en_description}
            p_id={promotions[0].p_id}
          />
        ) : (
          // Use slider for multiple promotions
          <Slider {...sliderSettings} ref={sliderRef}>
            {promotions.map(promo => (
              <div key={promo.id}>
                <PromotionCard
                  imageUrl={promo.image}
                  name={promo.name}
                  description={promo.en_description}
                  p_id={promo.p_id}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}

export default PromotionList;
