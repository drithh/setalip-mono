'use client';
import ImageWithFallback from '@/lib/image-with-fallback';

import { Label } from '@repo/ui/components/ui/label';
import { Trash } from 'lucide-react';
import { Input } from '@repo/ui/components/ui/input';
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

interface DeletableImageProps {
  src: string;
  alt: string;
}
const DeletableImage = ({ src, alt }: DeletableImageProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="group relative">
        <ImageWithFallback
          alt={alt}
          src={src}
          className="aspect-square w-full rounded-md object-cover "
          height="84"
          width="84"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-80 opacity-0 group-hover:opacity-60">
          <button className="rounded-md  p-1">
            <Trash className="h-8 w-8 text-muted-foreground" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus foto ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Ini akan menghapus foto lokasi dari
            server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction>Ya, Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeletableImage };
