'use server';

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
import { redirect, useRouter } from 'next/navigation';
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
import { getAuth } from '@/lib/get-auth';
import FacilityCard from './facility-card';
import EditDetailLocationForm from './edit-detail-location.form';
import CreateFacilityForm from './create-facility.form';
import OperationalHour from './operational-hour';
import EditOperationalHourForm from './edit-operational-hour.form';
import DeleteLocation from './delete-location.dialog';

export default async function LocationDetail({
  params,
}: {
  params: { locationId: string };
}) {
  const auth = await getAuth();
  if (!auth) {
    redirect('/login');
  }

  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locationIdNumber = parseInt(params.locationId);
  if (isNaN(locationIdNumber)) {
    redirect('/locations');
  }
  const location = await locationService.findById(locationIdNumber);

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
          <DeleteLocation location={location.result} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_390px] lg:gap-8 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8 xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row place-content-between place-items-center">
              <CardTitle>Detail Lokasi</CardTitle>
              <EditDetailLocationForm location={location.result} />
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
            <CardHeader className="flex flex-row place-content-between place-items-center">
              <CardTitle>Fasilitas</CardTitle>
              <CreateFacilityForm locationId={location.result.id} />
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 lg:grid-cols-2">
                {location.result?.facilities.map((facility, index) => (
                  <FacilityCard key={index} facility={facility} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row place-content-between place-items-center">
              <CardTitle>Waktu Operasional</CardTitle>
              <EditOperationalHourForm location={location.result} />
            </CardHeader>
            <CardContent>
              <OperationalHour
                operationalHours={location.result?.operational_hours}
              />
            </CardContent>
          </Card>

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
      </div>
    </main>
  );
}
