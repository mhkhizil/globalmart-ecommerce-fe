import React, { memo } from 'react';

interface ProfileIconProps {
  isSelected?: boolean;
  className?: string;
}

const ProfileIcon = memo(
  ({ isSelected = false, className = '' }: ProfileIconProps) => {
    return (
      <div
        className={`relative w-6 h-6 flex items-center justify-center ${className}`}
      >
        <svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.83335 7.8001C10.8216 7.8001 12.4333 6.18832 12.4333 4.2001C12.4333 2.21187 10.8216 0.600098 8.83335 0.600098C6.84512 0.600098 5.23335 2.21187 5.23335 4.2001C5.23335 6.18832 6.84512 7.8001 8.83335 7.8001Z"
            fill={isSelected ? '#FE8C00' : 'none'}
            stroke={isSelected ? '#FE8C00' : 'black'}
            strokeWidth="1.5"
          />
          <path
            d="M0.43335 18.6001C0.43335 13.9609 4.19416 10.2001 8.83335 10.2001C13.4725 10.2001 17.2333 13.9609 17.2333 18.6001H0.43335Z"
            fill={isSelected ? '#FE8C00' : 'none'}
            stroke={isSelected ? '#FE8C00' : 'black'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }
);

ProfileIcon.displayName = 'ProfileIcon';
export default ProfileIcon;
