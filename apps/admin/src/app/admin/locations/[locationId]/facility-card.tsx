'use client';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { SelectDetailLocation } from '@repo/shared/repository';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@repo/ui/components/ui/card';

import Link from 'next/link';
import { User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditFacilityForm from './edit-facility.form';
import { useDeleteFacilityMutation } from './_functions/delete-facility';
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

interface FacilityCardProps {
  facility: SelectDetailLocation['facilities'][0];
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const router = useRouter();
  const deleteFacility = useDeleteFacilityMutation();
  const onDelete = () => {
    deleteFacility.mutate(
      {
        facilityId: facility.id,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };
  return (
    <Card key={facility?.id} className="sm:col-span-1">
      <CardHeader>
        <AspectRatio ratio={16 / 9}>
          <ImageWithFallback
            src={facility.image_url || 'placeholder.svg'}
            alt={facility.name}
            fill
            className="rounded-lg object-cover"
          />
        </AspectRatio>

        <CardTitle>{facility.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        <div className="flex content-between items-center gap-2">
          <p>Kapasitas: </p>
          <div className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            <p>{facility.capacity}</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <p>Level:</p>
          <p>{facility.level}</p>
        </div> */}
      </CardContent>
      <CardFooter className="flex place-content-between">
        <EditFacilityForm facility={facility} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'} type="button">
              Hapus Fasilitas
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah kamu yakin menghapus fasilitas{' '}
                <span className="font-semibold">{facility.name}</span>?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Aksi ini tidak dapat dibatalkan. Ini akan menghapus fasilitas
                beserta foto dari server.
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
      </CardFooter>
    </Card>
  );
}
