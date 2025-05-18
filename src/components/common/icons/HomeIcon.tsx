import React, { memo } from 'react';

interface HomeIconProps {
  isSelected?: boolean;
  className?: string;
}

const HomeIcon = memo(
  ({ isSelected = false, className = '' }: HomeIconProps) => {
    return (
      <div
        className={`relative w-6 h-6 flex items-center justify-center ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3.76929 9L12.4231 2L21.077 9V20C21.077 20.5304 20.8744 21.0391 20.5137 21.4142C20.1531 21.7893 19.6639 22 19.1539 22H5.69236C5.18233 22 4.69319 21.7893 4.33254 21.4142C3.9719 21.0391 3.76929 20.5304 3.76929 20V9Z"
            stroke={isSelected ? '#FE8C00' : 'black'}
            fill={isSelected ? '#FE8C00' : 'none'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.53845 22V12H15.3077V22"
            stroke={isSelected ? 'white' : 'black'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
);

HomeIcon.displayName = 'HomeIcon';
export default HomeIcon;
