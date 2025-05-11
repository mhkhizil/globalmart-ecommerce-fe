'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { HTMLAttributes, memo, useCallback, useState } from 'react';

// Types
interface CategoryCardProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  isSelected?: boolean;
  onSelectToggle?: (name: string, selected: boolean) => void;
}

// Constants
const IMAGE_WIDTH_PX = 32; // 4rem = 64px (assuming 1rem = 16px)
const IMAGE_SIZES = `${IMAGE_WIDTH_PX}px`;
const FALLBACK_IMAGE = '/food-fallback.png'; // Ensure this exists in /public

// Component
const CategoryCard = memo(
  ({
    imageUrl,
    name,
    isSelected = false,
    onSelectToggle,
    className,
    ...rest
  }: CategoryCardProps) => {
    const [hasImageFailed, setHasImageFailed] = useState(false);
    const handleToggle = useCallback(() => {
      onSelectToggle?.(name, !isSelected);
    }, [name, isSelected, onSelectToggle]);

    const handleImageError = useCallback(() => {
      setHasImageFailed(true); // Set flag to prevent further retries
    }, []);

    return (
      <article
        className={clsx(
          'flex flex-col items-center justify-start w-full min-h-[5rem] max-h-[5rem] p-2 rounded-md shadow-category-card border border-gray-200 cursor-pointer text-sm leading-5 font-medium text-[#878787] bg-white transition-all duration-200 hover:bg-[#FE8C00] hover:text-white',
          {
            'bg-[#FE8C00] text-white': isSelected,
            'bg-white text-[#878787]': !isSelected,
          },
          className
        )}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-label={`Select category ${name}`}
        onKeyDown={event => event.key === 'Enter' && handleToggle()}
        {...rest}
      >
        {imageUrl && !hasImageFailed ? (
          <div className="w-[2rem] h-[2rem] overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt={name}
              width={256}
              height={256}
              sizes={IMAGE_SIZES}
              className="w-full h-full object-cover"
              priority={false}
              onError={handleImageError} // Trigger once, then switch to fallback
            />
          </div>
        ) : (
          <div className="w-[2rem] h-[2rem] overflow-hidden rounded-md">
            <Image
              src={FALLBACK_IMAGE}
              alt="Fallback image"
              width={IMAGE_WIDTH_PX}
              height={IMAGE_WIDTH_PX}
              sizes={IMAGE_SIZES}
              className="w-full h-full object-cover"
              priority={false}
            />
          </div>
        )}
        <span className="mt-1 text-center text-[12px] leading-[15px] text-wrap w-full">
          {name}
        </span>
      </article>
    );
  }
);

CategoryCard.displayName = 'CategoryCard';
export default CategoryCard;
