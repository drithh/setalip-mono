'use client';
import { PhotoView } from 'react-photo-view';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { Button } from '@repo/ui/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@repo/ui/components/ui/alert-dialog';

type FileWithPreview = File & { preview: string };

interface AssetCardProps {
  file: FileWithPreview;
  onDelete?: () => void;
  progress?: boolean;
}

export default function FileCard({ file, onDelete, progress }: AssetCardProps) {
  return (
    <div className="group relative h-40 cursor-pointer overflow-hidden">
      <PhotoView src={file.preview}>
        <ImageWithFallback
          className="aspect-square rounded-md object-contain"
          fill
          src={file.preview}
          alt={file.name || 'Image'}
        />
      </PhotoView>
      {progress ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50">
          <LoaderCircle className="h-16 w-16 animate-spin text-gray-300" />
        </div>
      ) : (
        onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild className="absolute inset-x-2 bottom-2">
              <Button
                variant={'destructive'}
                type="button"
                className=" opacity-0 group-hover:animate-slide-in-up"
              >
                Hapus
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin menghapus foto ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Aksi ini tidak dapat dibatalkan. Ini akan menghapus foto
                  lokasi dari server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant={'destructive'} onClick={onDelete}>
                    Ya, Hapus
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      )}
    </div>
  );
}
