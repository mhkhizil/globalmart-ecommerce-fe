'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const SpecialOffers = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-md overflow-hidden bg-white relative cursor-pointer shadow-sm"
    >
      {/* Container with flex layout to place image on left and content on right */}
      <div className="flex flex-row items-center gap-x-4">
        {/* Left side - Image */}
        <div className="flex-shrink-0 w-32 h-28 p-1 relative flex items-center justify-center">
          <Image
            src="/images/special_offer_logo.png"
            alt="Special offers logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="flex-grow py-4 pr-4 flex flex-col space-y-2">
          {/* Title and Emoji */}
          <div className="flex flex-row items-center gap-2">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-black font-[Montserrat] font-medium text-base"
            >
              Special Offers
            </motion.h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
              className="h-[18px] w-[18px] rounded-[9px] bg-white flex items-center justify-center shadow-[0px_0.25px_0.75px_0px_rgba(0,0,0,0.2),inset_-0.25px_-0.75px_0px_0px_rgba(0,0,0,0.1)] border border-[rgba(0,0,0,0.15)]"
            >
              <span className="text-[10.5px] font-bold text-[rgba(0,0,0,0.8)]">
                😱
              </span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-black font-[Montserrat] font-light text-xs leading-tight max-w-[90%]"
          >
            We make sure you get the offer you need at best prices
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialOffers;
