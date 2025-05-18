import React, { memo } from 'react';

interface SearchIconProps {
  isSelected?: boolean;
  className?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({
  isSelected = false,
  className = '',
}) => {
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
          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
          stroke={isSelected ? '#FE8C00' : 'black'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 20.9999L16.65 16.6499"
          stroke={isSelected ? '#FE8C00' : 'black'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default memo(SearchIcon);
