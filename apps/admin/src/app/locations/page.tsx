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
import { MapPin, Phone } from 'lucide-react';

export default async function Locations() {
  const locationService = container.get<LocationService>(TYPES.LocationService);

  const locations = await locationService.getLocations();
  return (
    <main className="bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 flex flex-1 flex-col gap-4 lg:gap-6 ">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Location</h1>
      </div>
      {locations?.result && locations.result.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4">Add Product</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {locations.result?.map((location) => (
            <Card key={location?.id} className="sm:col-span-1">
              <CardHeader>
                <AspectRatio ratio={16 / 9}>
                  <ImageWithFallback
                    src={location.assets[0]?.url}
                    alt={location.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>

                <CardTitle>{location.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <MapPin className="h-5 w-5" />
                    {location.address}
                  </div>
                  <div className="flex gap-1 items-center">
                    <Phone className="h-5 w-5" />
                    {location.phone_number}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>View Location</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
