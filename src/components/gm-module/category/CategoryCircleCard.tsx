import Image from 'next/image';
import { HTMLAttributes, memo, useCallback, useState } from 'react';

// Types
interface CategoryCircleCardProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  onClick?: () => void;
}

// Constants
const FALLBACK_IMAGE = '/food-fallback.png'; // Ensure this exists in /public

// Component
const CategoryCircleCard = memo(
  ({
    imageUrl,
    name,
    onClick,
    className,
    ...rest
  }: CategoryCircleCardProps) => {
    const [hasImageFailed, setHasImageFailed] = useState(false);

    const handleImageError = useCallback(() => {
      setHasImageFailed(true);
    }, []);

    const handleClick = useCallback(() => {
      onClick?.();
    }, [onClick]);

    return (
      <div
        className={`flex flex-col items-center justify-center w-full cursor-pointer ${className}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Category ${name}`}
        onKeyDown={event => event.key === 'Enter' && handleClick()}
        {...rest}
      >
        <div className="relative size-[56px] mb-2">
          <div className="absolute inset-0 rounded-full overflow-hidden bg-white shadow-sm">
            {imageUrl && !hasImageFailed ? (
              <Image
                src={imageUrl}
                alt={name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority={false}
                onError={handleImageError}
              />
            ) : (
              <Image
                src={FALLBACK_IMAGE}
                alt="Fallback image"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority={false}
              />
            )}
          </div>
        </div>
        <span className="text-center text-[10px] font-normal font-['Montserrat'] text-wrap leading-[1.6em] text-[#21003D]">
          {name}
        </span>
      </div>
    );
  }
);

CategoryCircleCard.displayName = 'CategoryCircleCard';
export default CategoryCircleCard;
