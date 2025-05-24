'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const TrendingProducts = () => {
  return (
    <motion.div
      className="flex w-full items-center justify-between bg-[#FD6E87] rounded-lg p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-['Montserrat'] font-medium text-white text-base leading-5">
          Trending Products
        </h2>
        <div className="flex items-center gap-1">
          <Image
            src="/images/calendar.svg"
            alt="Calendar"
            width={16}
            height={16}
          />
          <span className="font-['Montserrat'] font-normal text-white text-xs leading-4">
            Last Date 29/02/22
          </span>
        </div>
      </div>
      <Link
        href="/application/trending-product"
        className="flex items-center gap-1 border border-white rounded px-[10px] py-[6px]"
      >
        <span className="font-['Montserrat'] font-semibold text-white text-xs leading-4">
          View all
        </span>
        <Image
          src="/images/trending-arrow.svg"
          alt="Arrow"
          width={16}
          height={16}
        />
      </Link>
    </motion.div>
  );
};

export default TrendingProducts;
