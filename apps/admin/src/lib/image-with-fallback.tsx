'use client';
import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'Next/image';
interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  fallback?: string;
  alt: string;
  src?: string;
}

const fallbackImage = '/placeholder.svg';

const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      alt={alt}
      src={imgSrc || fallback}
      onError={() => setImgSrc(fallback)}
      {...props}
    />
  );
};

export { ImageWithFallback };
