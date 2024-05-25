'use client';
import { PhotoProvider } from 'react-photo-view';
import FileCard from './file-card';
import { SelectDetailLocation } from '@repo/shared/repository';
import DeleteLocationAssetForm from './delete-location-asset.form';
import { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
interface LocationAssetsProps {
  assets: SelectDetailLocation['assets'];
}

type FileWithPreview = File & { preview: string };

export default function LocationAssets({ assets }: LocationAssetsProps) {
  const [deleteAssetId, setDeleteAssetId] = useState<number>(-1);

  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  return (
    <>
      <PhotoProvider>
        <div className="grid grid-cols-2 gap-2" ref={parent}>
          {assets.map((image, index) => (
            <FileCard
              key={image.url}
              file={
                {
                  preview: image.url,
                  name: image.name,
                } as FileWithPreview
              }
              onDelete={() => setDeleteAssetId(image.id)}
            />
          ))}
        </div>
      </PhotoProvider>
      <DeleteLocationAssetForm assetId={deleteAssetId} />
    </>
  );
}
