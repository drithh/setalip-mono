'use client';
import { PhotoProvider } from 'react-photo-view';
import FileCard from './file-card';
import { SelectDetailLocation } from '@repo/shared/repository';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useDeleteAssetMutation } from '../_functions/delete-location-asset';
import { useRouter } from 'next/navigation';
interface LocationAssetsProps {
  assets: SelectDetailLocation['assets'];
}

type FileWithPreview = File & { preview: string };

export default function LocationAssets({ assets }: LocationAssetsProps) {
  const router = useRouter();
  const [parent] = useAutoAnimate(/* optional config */);
  const deleteLocationAsset = useDeleteAssetMutation();

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
              onDelete={() => {
                deleteLocationAsset.mutate(
                  {
                    assetId: image.id,
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                    },
                  },
                );
              }}
            />
          ))}
        </div>
      </PhotoProvider>
    </>
  );
}
