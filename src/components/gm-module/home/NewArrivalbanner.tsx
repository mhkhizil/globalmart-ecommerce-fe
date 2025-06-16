import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function NewArrivalbanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden rounded-lg bg-white shadow-sm"
    >
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg">
          <Image
            src="/images/hot_summer_sale.png"
            alt="Hot Summer Sale"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="p-4 text-center flex justify-between items-center">
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-medium text-black">New Arrivals</h2>
          <p className="text-base font-normal text-black mt-1">
            Summer&apos; 25 Collections
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/application/new-arrival"
            className="inline-flex items-center gap-1 rounded bg-[#F83758] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#e6324e]"
          >
            <span>View all</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M8 3L7.295 3.705L10.085 6.5H3V7.5H10.085L7.295 10.295L8 11L12 7L8 3Z"
                fill="white"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default NewArrivalbanner;
