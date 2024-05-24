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
import Link from 'next/link';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { LocationService } from '@repo/shared/service';
import { ChevronLeft, Phone, User2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Label } from '@repo/ui/components/ui/label';
import { Input } from '@repo/ui/components/ui/input';
import ImageCard from './file-card';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import 'react-photo-view/dist/react-photo-view.css';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/components/ui/sheet';
import FileCard from './file-card';
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import UploadLocationAsset from './upload-location-asset.form';
import LocationAssets from './location-assets';

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
          <Button variant={'default'}>Simpan</Button>
          <Button variant={'outline'}>Batal</Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Fasilitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {location.result?.facilities.map((facility, index) => (
                  <Card key={facility?.id} className="sm:col-span-1">
                    <CardHeader>
                      <AspectRatio ratio={16 / 9}>
                        <ImageWithFallback
                          src={facility.image_url}
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
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant={'outline'}>Edit Fasilitas</Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle className="text-left">
                              Edit Fasilitas
                            </SheetTitle>
                            <SheetDescription className="text-left">
                              Buat perubahan pada fasilitas ini, pastikan klik
                              simpan ketika selesai
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value="Pedro Duarte"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input
                                id="username"
                                value="@peduarte"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Link className="ml-auto" href={`/locations/`}></Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Foto Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <LocationAssets assets={location.result?.assets} />
              <UploadLocationAsset locationId={locationIdNumber} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
