import React, { memo } from 'react';

interface PaymentMenuIconProps {
  isSelected?: boolean;
  className?: string;
}

const PaymentMenuIcon = memo(
  ({ isSelected = false, className = '' }: PaymentMenuIconProps) => {
    return (
      <div
        className={`relative w-6 h-6 flex items-center justify-center ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={isSelected ? '#FE8C00' : 'black'}
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            fill={isSelected ? '#FE8C00' : 'none'}
            stroke={isSelected ? '#FE8C00' : 'black'}
          />
        </svg>
      </div>
    );
  }
);

PaymentMenuIcon.displayName = 'PaymentMenuIcon';
export default PaymentMenuIcon;
