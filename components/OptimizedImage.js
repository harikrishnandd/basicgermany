'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image Component with fallback and blur placeholder
 * Automatically uses Next.js Image optimization for better SEO and performance
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false,
  quality = 85,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to placeholder if image fails to load
  const handleError = () => {
    setImgSrc('/images/placeholder.jpg');
  };

  // For external images (Firebase Storage, etc.)
  const isExternal = src?.startsWith('http');

  if (isExternal) {
    return (
      <Image
        src={imgSrc}
        alt={alt || 'Image'}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
        quality={quality}
        priority={priority}
        unoptimized={false} // Enable Next.js optimization even for external URLs
        {...props}
      />
    );
  }

  // For local images
  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      onLoadingComplete={() => setIsLoading(false)}
      onError={handleError}
      quality={quality}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
      {...props}
    />
  );
}
