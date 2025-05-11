'use client';

import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

import { Shop } from '@/core/entity/Shop';

interface ShopCardProps {
  shop: Shop;
}

const ShopCard = memo(({ shop }: ShopCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to shop detail page
    router.push(`/application/product-list-by-shop?shopId=${shop.id}`);
  };

  //console.log(shop);

  // Determine if shop is currently open based on opening and closing times
  const isShopOpen = () => {
    if (!shop.opening_time || !shop.closing_time) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Parse opening time (assuming format like "09:00" or "9:00 AM")
    let openingHour = 0;
    let openingMinute = 0;

    if (shop.opening_time.includes(':')) {
      const [hourString, minuteString] = shop.opening_time.split(':');
      openingHour = Number.parseInt(hourString, 10);
      openingMinute = Number.parseInt(minuteString, 10);
      // Handle AM/PM format
      if (shop.opening_time.toLowerCase().includes('pm') && openingHour < 12) {
        openingHour += 12;
      }
    }

    // Parse closing time
    let closingHour = 0;
    let closingMinute = 0;

    if (shop.closing_time.includes(':')) {
      const [hourString, minuteString] = shop.closing_time.split(':');
      closingHour = Number.parseInt(hourString, 10);
      closingMinute = Number.parseInt(minuteString, 10);
      // Handle AM/PM format
      if (shop.closing_time.toLowerCase().includes('pm') && closingHour < 12) {
        closingHour += 12;
      }
    }

    const openingTime = openingHour * 60 + openingMinute;
    const closingTime = closingHour * 60 + closingMinute;

    return currentTime >= openingTime && currentTime <= closingTime;
  };

  const shopOpen = isShopOpen();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
        duration: 0.3,
      }}
      onClick={handleClick}
      className="flex-shrink-0 w-[100px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
    >
      {/* Container with fixed-dimension image */}
      <div className="flex items-center justify-center py-2 px-2 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="relative w-[80px] h-[80px] flex items-center justify-center overflow-hidden rounded-md bg-white">
          {shop.image ? (
            <Image
              src={shop.image}
              alt={shop.name || 'Shop'}
              width={80}
              height={80}
              className="max-w-[80px] max-h-[80px] min-w-[80px] min-h-[80px] "
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+/ahAQI8A/8BOz8L9gAAAABJRU5ErkJggg=="
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-orange-100">
              <Store className="text-orange-500" size={32} />
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-xs text-gray-800 truncate">
          {shop.name}
        </h3>

        {/* Shop Status */}
        <div className="flex items-center mt-2">
          <div
            className={`h-2 w-2 rounded-full ${shopOpen ? 'bg-green-500' : 'bg-red-500'} mr-1`}
          />
          <span className="text-xs text-gray-600">
            {shopOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

ShopCard.displayName = 'ShopCard';
export default ShopCard;
