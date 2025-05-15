'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

function AdsBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden bg-white shadow-md"
    >
      <div className="relative w-full flex h-[200px] items-center bg-gray-50 flex-shrink-0">
        <div className="h-full w-4 bg-gradient-to-r from-[#EFAD18] to-[#F8D7B4]"></div>
        <img src="/icons/sparkle.svg" alt="Filter" className="h-full" />
        <div className="absolute left-10">
          <img src="/icons/high-heel.svg" alt="Filter" className="" />
        </div>

        {/* Right side with text and button */}
        <div className=" pr-3 w-full flex flex-col items-end justify-center">
          <div className="flex flex-col items-center justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-montserrat font-medium text-[#232327] text-md leading-4"
            >
              Flat and Heels
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-montserrat font-normal text-[#232327] text-xs leading-4 mb-6"
            >
              Stand a chance to get rewarded
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="mt-1"
          >
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-[4px] font-montserrat bg-[#EF5466] px-2 py-1 text-base font-medium text-white transition-colors hover:bg-[#D63F51]"
            >
              <span>Visit now</span>
              <Image
                src="/images/trending-arrow.svg"
                alt="Arrow"
                width={16}
                height={16}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdsBanner;
