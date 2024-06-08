'use client';
import { useState, useEffect, forwardRef } from 'react';
import Image, { ImageProps } from 'Next/image';
interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  fallback?: string;
  alt: string;
  src?: string;
}

const fallbackImage = '/placeholder.svg';

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ fallback = fallbackImage, alt, src, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
      setImgSrc(src);
    }, [src]);

    return (
      <Image
        alt={alt}
        src={imgSrc || fallback}
        onError={() => setImgSrc(fallback)}
        ref={ref}
        {...props}
      />
    );
  },
);

ImageWithFallback.displayName = 'ImageWithFallback';

export { ImageWithFallback };
