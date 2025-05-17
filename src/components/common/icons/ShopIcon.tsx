import { Store } from 'lucide-react';
import React, { memo } from 'react';

interface ShopIconProps {
  isSelected?: boolean;
  className?: string;
}

const ShopIcon = memo(
  ({ isSelected = false, className = '' }: ShopIconProps) => {
    return (
      <div
        className={`relative w-6 h-6 flex items-center justify-center ${className}`}
      >
        <Store
          className="size-6"
          fill={isSelected ? '#FE8C00' : 'none'}
          stroke={isSelected ? '#FE8C00' : 'black'}
        />
      </div>
    );
  }
);

ShopIcon.displayName = 'ShopIcon';
export default ShopIcon;
