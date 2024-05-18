import { container, TYPES } from '@repo/shared/inversify';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { LocationService } from '@repo/shared/service';
import Image from 'next/image';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import ImageWithFallback from '@/lib/image-with-fallback';
import { ChevronLeft, MapPin, Phone } from 'lucide-react';
import { redirect } from 'next/navigation';

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
    <main className="flex flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <div className="flex gap-4">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
    </main>
  );
}
