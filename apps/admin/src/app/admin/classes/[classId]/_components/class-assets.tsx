'use client';
import { PhotoProvider } from 'react-photo-view';
import { SelectDetailClassAssetAndLocation } from '@repo/shared/repository';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useDeleteAssetMutation } from '../_functions/delete-class-asset';
import { useRouter } from 'next/navigation';
import FileCard from '@/app/admin/locations/[locationId]/_components/file-card';
interface ClassAssetsProps {
  assets: SelectDetailClassAssetAndLocation['asset'];
}

type FileWithPreview = File & { preview: string };

export default function ClassAssets({ assets }: ClassAssetsProps) {
  const router = useRouter();
  const [parent] = useAutoAnimate(/* optional config */);
  const deleteClassAsset = useDeleteAssetMutation();

  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 gap-2" ref={parent}>
        {assets?.map((image, index) => (
          <FileCard
            key={image.url}
            file={
              {
                preview: image.url,
                name: image.name,
              } as FileWithPreview
            }
            onDelete={() => {
              deleteClassAsset.mutate(
                {
                  id: image.id,
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
  );
}
