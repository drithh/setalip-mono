'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui/card';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import ImageWithFallback from '@/lib/image-with-fallback';
import { SelectDetailLocation } from '@repo/shared/repository';
import { Button } from '@repo/ui/components/ui/button';
import { Trash, Upload } from 'lucide-react';
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

interface ImageCardProps {
  assets: SelectDetailLocation['assets'];
}

export default function ImageCard({ assets }: ImageCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Foto Lokasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <PhotoProvider>
            {assets.map((image, index) => (
              <div className="group relative cursor-pointer overflow-hidden">
                <PhotoView key={index} src={image.url}>
                  <ImageWithFallback
                    className="aspect-square w-full rounded-md object-cover "
                    height="84"
                    width="84"
                    key={index}
                    src={image.url}
                    alt={image.name}
                  />
                </PhotoView>
                <AlertDialog>
                  <AlertDialogTrigger className="absolute inset-x-2 bottom-2">
                    <Button
                      variant={'destructive'}
                      className="w-full opacity-0 group-hover:animate-slide-in-up"
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
                      <AlertDialogAction>Ya, Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </PhotoProvider>
          <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Upload</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
