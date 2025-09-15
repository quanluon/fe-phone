'use client';

import React, { useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { DEFAULT_IMAGE } from '@/lib/utils';

interface NextImageProps extends Omit<ImageProps, 'onErrorCapture'> {
  /**
   * Custom error handler. If not provided, will use default error handling
   * that shows a placeholder image when the original image fails to load.
   */
  onErrorCapture?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Enhanced Next.js Image component with default error handling.
 * Automatically falls back to a placeholder image when the original image fails to load.
 */
export const NextImage: React.FC<NextImageProps> = ({ 
  onErrorCapture, 
  src,
  alt,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (hasError) {
      return; // Already handled
    }
    
    setHasError(true);
    
    if (onErrorCapture) {
      onErrorCapture(event);
    } else {
      // Set to placeholder image
      setImageSrc(DEFAULT_IMAGE);
    }
  }, [hasError, onErrorCapture]);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      onErrorCapture={handleError}
      {...props}
    />
  );
};

// Re-export the default image path for convenience
export { DEFAULT_IMAGE };
