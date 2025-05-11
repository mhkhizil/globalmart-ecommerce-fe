'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ArrowDownIcon from '@/components/common/icons/ArrowDownIcon';
import LocationIcon from '@/components/common/icons/LocationIcon';
import NotificationIcon from '@/components/common/icons/NotificationIcon';
import SearchIcon from '@/components/common/icons/SearchIcon';
import { PromotionListResponseDto } from '@/core/dtos/promotion/PromotionListResponseDto';
import { useGetPromoList } from '@/lib/hooks/service/promotion/useGetPromoList';
import { RootState } from '@/lib/redux/ReduxStore';
import { Locale } from '@/lib/redux/slices/LanguageSlice';

// CSS classes for the ticker
const tickerStyles = {
  container:
    'overflow-hidden bg-gradient-to-r from-orange-400/45 to-sky-500/45 text-white py-2 shadow-md relative backdrop-blur-[80%]',
  innerContainer: 'inline-block whitespace-nowrap animate-marquee',
  content: 'inline-block whitespace-nowrap text-[1.1rem] font-extrabold px-4',
  item: 'text-white hover:text-gray-100 transition-colors duration-200 no-underline drop-shadow-md',
  separator: 'mx-3 text-white opacity-80',
  fadeLeft:
    'absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-orange-400/45 to-transparent z-10',
  fadeRight:
    'absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-sky-500/45 to-transparent z-10',
  fallback: 'text-center py-1.5 text-[1.1rem] font-extrabold drop-shadow-md',
};

// Type for fallback promotions to match structure of API response
type FallbackPromotion = {
  id: string;
  name: string;
  en_description: string;
  mm_description: string;
  th_description: string;
  cn_description: string;
};

// Default fallback promotions for when API returns empty data
const fallbackPromotions: FallbackPromotion[] = [
  {
    id: 'fb-1',
    name: 'Takeout System Welcome',
    en_description:
      'Welcome to our takeout system! Enjoy fast delivery and delicious meals.',
    mm_description:
      'စားသောက်ဆိုင်မှာမှာစနစ်ကိုကြိုဆိုပါသည်။ မြန်ဆန်သောပို့ဆောင်မှုနှင့် အရသာရှိသောအစားအစာများကို ခံစားနိုင်ပါသည်။',
    th_description:
      'ยินดีต้อนรับสู่ระบบสั่งอาหารของเรา! เพลิดเพลินกับการจัดส่งที่รวดเร็วและอาหารอร่อย',
    cn_description: '欢迎使用我们的外卖系统！享受快速配送和美味佳肴。',
  },
  {
    id: 'fb-2',
    name: 'Easy Ordering',
    en_description:
      'Order your favorite food from local restaurants in just a few taps.',
    mm_description:
      'နေရာဒေသအလိုက်စားသောက်ဆိုင်များမှ သင်နှစ်သက်သောအစားအစာများကို တို့ထိမှုအနည်းငယ်ဖြင့် မှာယူနိုင်ပါသည်။',
    th_description: 'สั่งอาหารโปรดของคุณจากร้านอาหารท้องถิ่นได้ในไม่กี่แตะ',
    cn_description: '只需点击几下，即可从当地餐厅订购您喜爱的食物。',
  },
  {
    id: 'fb-3',
    name: 'New Restaurants',
    en_description:
      'Discover new restaurants and cuisines available for delivery near you.',
    mm_description:
      'သင့်အနီးတွင် ပို့ဆောင်ပေးနိုင်သော စားသောက်ဆိုင်အသစ်များနှင့် အစားအစာအမျိုးအစားများကို ရှာဖွေလေ့လာပါ။',
    th_description: 'ค้นพบร้านอาหารใหม่และอาหารที่มีให้บริการส่งใกล้คุณ',
    cn_description: '发现您附近可供送餐的新餐厅和美食。',
  },
  {
    id: 'fb-4',
    name: 'Free Delivery',
    en_description:
      'Free delivery on your first order. Use code WELCOME at checkout!',
    mm_description:
      'သင်၏ပထမဆုံးအော်ဒါတွင် အခမဲ့ပို့ဆောင်ပေးပါသည်။ ငွေရှင်းရာတွင် WELCOME ကုဒ်ကို အသုံးပြုပါ!',
    th_description:
      'จัดส่งฟรีสำหรับการสั่งซื้อครั้งแรกของคุณ ใช้รหัส WELCOME ที่จุดชำระเงิน!',
    cn_description: '首次订购免费送货。结账时使用代码WELCOME！',
  },
  {
    id: 'fb-5',
    name: 'App-Only Deals',
    en_description:
      'Exclusive app-only deals and discounts available right now.',
    mm_description:
      'အက်ပ်တွင်သာရရှိနိုင်သော အထူးဝယ်ယူမှုများနှင့် လျှော့စျေးများကို ယခုပင်ရရှိနိုင်ပါသည်။',
    th_description: 'ข้อเสนอและส่วนลดพิเศษเฉพาะแอปพลิเคชันมีให้บริการตอนนี้',
    cn_description: '独家应用专享优惠和折扣现已推出。',
  },
];

function Header() {
  const [address, setAddress] = useState<any>();
  const { data: promoList, isLoading } = useGetPromoList({
    type: 'ticker',
  });
  // Get current locale from Redux store
  const currentLocale = useSelector<RootState, Locale>(
    state => state.language.locale
  );

  //console.log('tickerList', promoList);
  const t = useTranslations();

  // Check if we have valid promotion data
  const hasValidPromoData =
    promoList?.promotion && promoList.promotion.length > 0;

  useEffect(() => {
    if ('geolocation' in navigator && !address) {
      navigator.geolocation.getCurrentPosition(async position => {
        // setValue(
        //   'latlong',
        //   `${position.coords.latitude}|${position.coords.longitude}`
        // );
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        setAddress(data);
      });
    }
  }, [address, setAddress]);

  // Helper function to get the display text for a promotion based on current locale
  const getPromoText = (promo: any) => {
    // Default to English if the specific locale description is not available
    switch (currentLocale) {
      case 'en': {
        return promo.en_description || promo.name || 'Special Promotion';
      }
      case 'mm': {
        return (
          promo.mm_description ||
          promo.en_description ||
          promo.name ||
          'Special Promotion'
        );
      }
      case 'th': {
        return (
          promo.th_description ||
          promo.en_description ||
          promo.name ||
          'Special Promotion'
        );
      }
      case 'cn': {
        return (
          promo.cn_description ||
          promo.en_description ||
          promo.name ||
          'Special Promotion'
        );
      }
      default: {
        return promo.en_description || promo.name || 'Special Promotion';
      }
    }
  };

  // Render the ticker if we have data, otherwise don't show it
  const renderTicker = () => {
    if (isLoading) {
      return; // Don't show anything while loading
    }

    if (!hasValidPromoData) {
      return; // Don't show anything if there's no data
    }

    return (
      <div className={tickerStyles.container}>
        {/* Fade effect on the left */}
        <div className={tickerStyles.fadeLeft}></div>

        <div className={tickerStyles.innerContainer}>
          <div className={tickerStyles.content}>
            {promoList.promotion.map(promo => (
              <React.Fragment key={promo.id}>
                <Link
                  href={`/application/promo/${promo.id}`}
                  className={tickerStyles.item}
                >
                  {getPromoText(promo)}
                </Link>
                <span className={tickerStyles.separator}>•</span>
              </React.Fragment>
            ))}
          </div>
          {/* Duplicate content for continuous scrolling effect */}
          <div className={tickerStyles.content}>
            {promoList.promotion.map(promo => (
              <React.Fragment key={`dup-${promo.id}`}>
                <Link
                  href={`/application/promo/${promo.id}`}
                  className={tickerStyles.item}
                >
                  {getPromoText(promo)}
                </Link>
                <span className={tickerStyles.separator}>•</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Fade effect on the right */}
        <div className={tickerStyles.fadeRight}></div>
      </div>
    );
  };

  return (
    <div className="relative flex w-full min-h-[8.5rem] pt-3 pb-[0.5rem] px-[1.5rem] flex-col">
      <Image
        alt=""
        src={
          'https://utfs.io/f/4PbNtc78sfabWo7n43BoXE2y3OQsmJrnK1tzNMFajdgZb7eA'
        }
        width={512}
        height={512}
        className="absolute inset-0 w-full h-full z-0 "
      ></Image>
      <div className="flex w-full z-10 text-white">
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-[0.6875rem]">
            <div className="text-sm leading-[1.25rem]">
              {t('home.yourLocation')}
            </div>
            <>
              <ArrowDownIcon />
            </>
          </div>
          <div className="flex items-center gap-x-[0.5rem] mt-[0.75rem]">
            <div className="flex-shrink-0 flex">
              <LocationIcon />
            </div>
            <div className="flex flex-col">
              {address && (
                <>
                  {/* <span className="text-white text-sm  font-[600]">
                    {`${address?.address?.quarter}, ${address?.address?.suburb}`}
                  </span> */}
                  <span className="text-white text-[10px]  font-[600]">
                    {`${address?.address?.city}, ${address?.address?.country}`}
                  </span>
                </>
              )}
              {!address && <span>--</span>}
            </div>
          </div>
        </div>
        <div className="flex  justify-end gap-x-[1rem]">
          <div>
            <SearchIcon />
          </div>
          <div>
            <Link href="/application/promo-list">
              <NotificationIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Only render ticker section if there's valid promotion data */}
      {hasValidPromoData && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {renderTicker()}
        </div>
      )}
    </div>
  );
}

export default Header;
