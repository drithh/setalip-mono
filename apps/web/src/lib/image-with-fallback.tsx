'use client';
import Image, { ImageProps } from 'next/image';
import { forwardRef,useEffect, useState } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'alt'> {
  fallback?: string;
  alt: string | null;
  src: string | null;
}
const fallbackImage = '/placeholder.svg';

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  (
    { fallback = fallbackImage, alt = 'Image', src = fallbackImage, ...props },
    ref,
  ) => {
    const [imgSrc, setImgSrc] = useState(src ?? fallbackImage);
    useEffect(() => {
      setImgSrc(src ?? fallbackImage);
    }, [src]);

    return (
      <Image
        alt={alt || 'Image'}
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
