'use client';
import { PhotoProvider } from 'react-photo-view';
import FileCard from './file-card';
import { SelectDetailLocation } from '@repo/shared/repository';

interface LocationAssetsProps {
  assets: SelectDetailLocation['assets'];
}

type FileWithPreview = File & { preview: string };

export default function LocationAssets({ assets }: LocationAssetsProps) {
  return (
    <PhotoProvider>
      {assets.map((image, index) => (
        <FileCard
          key={index}
          file={
            {
              preview: image.url,
              name: image.name,
            } as FileWithPreview
          }
          onDelete={() => {}}
        />
      ))}
    </PhotoProvider>
  );
}
