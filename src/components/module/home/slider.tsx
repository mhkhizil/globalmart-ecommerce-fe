'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Slider from 'react-slick';

import RightArrow from '@/components/common/icons/RightArrow';

function HomePageSlider() {
  const sliderRef = useRef(null);
  const router = useRouter();
  const settings = {
    customPaging: function (index: any) {
      return (
        <div className="h-[6px] w-[24px] rounded-[100px] custom-dots"></div>
      );
    },
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: 'slick-dots custom-dots',
    arrows: false,
  };
  return (
    <div className="w-full sm:w-[29rem] relative bg-[#FE8C00] h-[25rem] rounded-[55px] pt-[2rem]">
      <div className="slider-container w-full ">
        <Slider ref={sliderRef} {...settings} className="text-white">
          <div className="flex w-full items-center justify-center flex-col text-center">
            <div className="text-[2rem] font-[600] leading-[40px]">
              We serve{' '}
            </div>
            <div className="text-[2rem] font-[600] leading-[40px]">
              incomparable
            </div>
            <div className="text-[2rem] font-[600] leading-[40px]">
              delicacies
            </div>
            <div className="text-[14px] font-[400] leading-[20px] mt-[16px]">
              All the best restaurants with their top
            </div>
            <div className="text-[14px] font-[400] leading-[20px]">
              {"menu waiting for you, they cant't wait"}
            </div>
            <div className="mb-[16px] text-[14px] font-[400] leading-[20px]">
              for your order!!
            </div>
          </div>
          <div className="flex w-full items-center justify-center flex-col text-center">
            <div className="text-[2rem] font-[600] leading-[40px]">
              We serve{' '}
            </div>
            <div className="text-[2rem] font-[600] leading-[40px]">
              incomparable
            </div>
            <div className="text-[2rem] font-[600] leading-[40px]">
              delicacies
            </div>
            <div className="text-[14px] font-[400] leading-[20px] mt-[16px]">
              All the best restaurants with their top
            </div>
            <div className="text-[14px] font-[400] leading-[20px]">
              {" menu waiting for you, they cant't wait"}
            </div>
            <div className="mb-[16px] text-[14px] font-[400] leading-[20px]">
              for your order!!
            </div>
          </div>
          <div className="flex w-full items-center justify-center flex-col text-center">
            <div className="text-[2rem] font-[600] leading-[40px]">
              We serve{' '}
            </div>
            <div className="text-[2rem] font-[600] leading-[40px]">
              incomparable
            </div>
            <div className="text-[2rem] font-[600] leading-[40px]">
              delicacies
            </div>
            <div className="text-[14px] font-[400] leading-[20px] mt-[16px]">
              All the best restaurants with their top
            </div>
            <div className="text-[14px] font-[400] leading-[20px]">
              {"menu waiting for you, they cant't wait"}
            </div>
            <div className="mb-[16px] text-[14px] font-[400] leading-[20px]">
              for your order!!
            </div>
          </div>
        </Slider>
      </div>
      <div className="flex w-full absolute bottom-[2rem] px-[2rem] items-end">
        <div className="flex w-full text-white text-[14px] font-[600] leading-[20px]">
          <button>Skip</button>
        </div>
        <div className="flex w-full justify-end text-white">
          <button
            onClick={() => {
              if (
                sliderRef.current &&
                (sliderRef.current as any).innerSlider.state.currentSlide < 2
              ) {
                (sliderRef.current as any).slickNext();
              } else {
                router.push('/login');
              }
            }}
            className="flex items-center justify-center gap-x-[10px]"
          >
            <span className="text-[14px] font-[600] leading-[20px]">Next</span>
            <RightArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePageSlider;
