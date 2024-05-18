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
import { Textarea } from '@repo/ui/components/ui/textarea';
import { LocationService } from '@repo/shared/service';
import Image from 'next/image';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import ImageWithFallback from '@/lib/image-with-fallback';
import { ChevronLeft, MapPin, Phone, Trash, Upload } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Label } from '@repo/ui/components/ui/label';
import { Input } from '@repo/ui/components/ui/input';
import { DeletableImage } from './deletable-image';

export default async function LocationDetail({
  params,
}: {
  params: { locationId: string };
}) {
  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locationIdNumber = parseInt(params.locationId);
  if (isNaN(locationIdNumber)) {
    redirect('/locations');
  }
  const location = await locationService.findLocationById(locationIdNumber);

  if (!location.result) {
    redirect('/locations');
  }

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <div className="flex place-items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {location.result?.name}
        </h1>
        <div className="ml-auto flex gap-4">
          <Button variant={'default'}>Edit</Button>
          <Button variant={'outline'}>Delete</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Detail Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    readOnly
                    type="text"
                    className="w-full"
                    defaultValue={location.result?.name}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    readOnly
                    className="w-full"
                    defaultValue={location.result?.address}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    readOnly
                    type="text"
                    className="w-full"
                    defaultValue={location.result?.phone_number}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    readOnly
                    type="email"
                    className="w-full"
                    defaultValue={location.result?.email}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                  <Textarea
                    id="googleMapsUrl"
                    readOnly
                    className="w-full"
                    defaultValue={location.result?.link_maps}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Foto Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {location.result?.assets.map((image, index) => (
                <DeletableImage key={index} src={image.url} alt={image.name} />
              ))}
              <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Upload</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
