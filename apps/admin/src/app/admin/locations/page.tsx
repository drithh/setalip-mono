import { container, TYPES } from '@repo/shared/inversify';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { LocationService } from '@repo/shared/service';
import Image from 'next/image';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import CreateLocationForm from './create-location.form';

export default async function Locations() {
  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locations = await locationService.findAll();
  return (
    <main className="flex flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6 ">
      {
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.result?.map((location) => (
            <Card key={location?.id} className="sm:col-span-1">
              <CardHeader>
                <AspectRatio ratio={16 / 9}>
                  <ImageWithFallback
                    src={location.asset_url || '/placeholder.svg'}
                    alt={location.asset_name || 'placeholder'}
                    fill
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>
              </CardHeader>
              <CardContent>
                <CardTitle>{location.name}</CardTitle>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <p>{location.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <p>{location.phone_number}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full place-content-between">
                  <Link href={`/admin/locations/${location.id}`}>
                    <Button variant={'outline'}>Edit Lokasi</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
          <Card className="flex min-h-[30rem] flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Tambah Lokasi
              </h3>
              <p className="text-sm text-muted-foreground">
                Tambahkan lokasi baru atau cabang baru
              </p>
              <CreateLocationForm />
              {/* <Button className="mt-4">Tambah Lokasi</Button> */}
            </div>
          </Card>
        </div>
      }
    </main>
  );
}
