import { motion } from 'framer-motion';
import React, { memo } from 'react';

interface CartIconProps {
  isSelected?: boolean;
  className?: string;
}

const CartIcon = memo(
  ({ isSelected = false, className = '' }: CartIconProps) => {
    return (
      <div
        className={`relative w-14 h-14 flex items-center justify-center ${className}`}
      >
        <motion.div
          className="absolute inset-0 bg-[#EB3030] rounded-full shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: 'spring' }}
        />
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="17"
            viewBox="0 0 24 17"
            fill="none"
          >
            <path
              d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
              stroke="#E9E9E9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    );
  }
);

CartIcon.displayName = 'CartIcon';
export default CartIcon;
