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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import Link from 'next/link';
import { User2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'sonner';
import EditFacilityForm from './edit-facility.form';

interface FacilityCardProps {
  facility: SelectDetailLocation['facilities'][0];
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const [openSheet, setOpenSheet] = useState(false);

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
      <CardContent className="grid grid-cols-2 gap-2">
        <div className="flex content-between items-center gap-2">
          <p>Kapasitas: </p>
          <div className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            <p>{facility.capacity}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p>Level:</p>
          <p>{facility.level}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild>
            <Button variant={'outline'}>Edit Fasilitas</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">Edit Fasilitas</SheetTitle>
              <SheetDescription className="text-left">
                Buat perubahan pada fasilitas ini, pastikan klik simpan ketika
                selesai
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <EditFacilityForm
                facility={facility}
                closeSheet={() => setOpenSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
        <Link className="ml-auto" href={`/locations/`}></Link>
      </CardFooter>
    </Card>
  );
}
