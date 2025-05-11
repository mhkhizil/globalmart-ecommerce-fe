'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface FallbackImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

/**
 * A wrapper around Next.js Image component that handles fallback images
 * when the primary source fails to load.
 */
export default function FallbackImage({
  src,
  fallbackSrc: fallbackSource = '/food-fallback.png',
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSource, setImgSource] = useState<string>(src || fallbackSource);
  const [error, setError] = useState<boolean>(false);

  // Handle image load error
  const handleError = () => {
    // Only set fallback if we're not already using it
    if (!error && imgSource !== fallbackSource) {
      setImgSource(fallbackSource);
      setError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imgSource}
      alt={alt || ''}
      onError={handleError}
      // Add blur placeholder for better UX during loading
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJcIiLKlQAAAABJRU5ErkJggg=="
    />
  );
}
