'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Shop } from '@/core/entity/Shop';

import ShopCard from './ShopCard';

interface ShopListProps {
  shops: Shop[];
  isLoading: boolean;
  error?: Error;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Skeleton loader for shops
const renderSkeletons = () => {
  return Array.from({ length: 5 })
    .fill(0)
    .map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex-shrink-0 w-[150px] bg-gray-100 rounded-lg overflow-hidden shadow-sm animate-pulse"
      >
        {/* Skeleton for centered square image */}
        <div className="flex items-center justify-center py-2 px-2 bg-gray-200">
          <div className="w-[100px] h-[100px] bg-gray-300 rounded-md"></div>
        </div>
        <div className="p-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ));
};

const ShopList = ({ shops, isLoading, error }: ShopListProps) => {
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 300; // Pixels to scroll

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col w-full mt-6 px-4">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          className="text-lg font-semibold text-gray-900 mb-4"
        >
          {t('home.nearbyShops')}
        </motion.h2>
        <div className="w-full p-4 bg-red-50 rounded-lg text-red-500 text-center">
          {t('errors.failedToLoad')}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mt-2">
      <div className="flex items-center justify-between px-4 mb-3">
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          className="text-lg font-semibold text-gray-900"
        >
          {t('home.nearbyShops')}
        </motion.h2>

        {/* Navigation buttons */}
        {!isLoading && shops.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full text-orange-600 hover:bg-orange-200 transition-colors"
              aria-label={t('common.scrollLeft')}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full text-orange-600 hover:bg-orange-200 transition-colors"
              aria-label={t('common.scrollRight')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto gap-4 pb-4 px-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 min-w-min"
          >
            {isLoading ? (
              renderSkeletons()
            ) : shops.length > 0 ? (
              shops.map(shop => <ShopCard key={shop.id} shop={shop} />)
            ) : (
              <div className="flex flex-col items-center justify-center w-full min-h-[150px] bg-gray-50 rounded-lg p-4">
                <Store className="text-gray-400 mb-2" size={24} />
                <p className="text-gray-500 text-sm">
                  {t('merchantHome.noShopsAvailable')}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShopList;
