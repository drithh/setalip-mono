import { container, TYPES } from '@repo/shared/inversify';
import { LocationService } from '@repo/shared/service';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Carousel,
  CarouselMainContainer,
  SliderMainItem,
  CarouselThumbsContainer,
  CarouselIndicator,
} from '@repo/ui/components/ui/carousel';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import { Mail, MapPin, Phone, User2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@repo/ui/components/ui/card';
import { format, setDay } from 'date-fns';
import { SelectDetailLocation } from '@repo/shared/repository';
import { Separator } from '@repo/ui/components/ui/separator';
import { ImageWithFallback } from '@/lib/image-with-fallback';

export default async function LocationDetail({
  params,
}: {
  params: { locationId: string };
}) {
  const locationService = container.get<LocationService>(TYPES.LocationService);
  const locationIdNumber = parseInt(params.locationId);
  if (isNaN(locationIdNumber)) {
    redirect('/#locations');
  }
  const singleLocation = await locationService.findById(locationIdNumber);

  if (!singleLocation.result) {
    redirect('/#locations');
  }

  function getDayName(dayNumber: number) {
    // Set the date to the specified day of the week
    const date = setDay(new Date(), dayNumber + 1, { weekStartsOn: 0 });
    // Format the date to get the day name
    return format(date, 'EEEE');
  }

  const fillEmptyDays = (
    operationalHours: SelectDetailLocation['operational_hours'],
  ) => {
    const days = Array.from({ length: 7 }, (_, i) => i);
    return days.map((day) => {
      const operational = operationalHours.find(
        (operational) => operational.day_of_week === day,
      );
      if (operational) {
        return operational;
      }
      return {
        day_of_week: day,
        opening_time: 'Closed',
        closing_time: 'Closed',
      };
    }) as SelectDetailLocation['operational_hours'];
  };

  return (
    <div>
      <div className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid  gap-6 px-4 md:px-6  lg:grid-cols-[5fr_3fr] lg:gap-12">
            <div className="flex flex-col gap-4">
              <Carousel className="m-0 w-full">
                <div className="relative w-full overflow-hidden rounded-xl">
                  <CarouselMainContainer className="">
                    {singleLocation.result.assets?.map((src, index) => (
                      <SliderMainItem
                        key={index}
                        className="relative h-full w-full bg-transparent p-0"
                      >
                        <AspectRatio ratio={16 / 12}>
                          <Image
                            fill
                            className="absolute object-cover"
                            alt={src.name}
                            src={src.url}
                          />
                        </AspectRatio>
                      </SliderMainItem>
                    ))}
                  </CarouselMainContainer>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <CarouselThumbsContainer className="gap-x-1 ">
                      {singleLocation.result.assets?.map((_, index) => (
                        <CarouselIndicator key={index} index={index} />
                      ))}
                    </CarouselThumbsContainer>
                  </div>
                </div>
              </Carousel>
            </div>
            <div className="row-span-2 flex  flex-col gap-2 space-y-4">
              <div className="flex flex-col gap-4 space-y-2">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {singleLocation.result.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                    <p className="text-muted-foreground md:text-xl">
                      {singleLocation.result.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-medium ">Contact</h1>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {singleLocation.result.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-6 w-6 text-muted-foreground" />
                    <p className="max-w-[600px] text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                      {singleLocation.result.phone_number}
                    </p>
                  </div>
                </div>
              </div>
              <iframe
                src={singleLocation.result.link_maps}
                className="h-[20rem] w-full rounded-xl border p-1"
                loading="lazy"
              ></iframe>
              <Button className="w-full ">Get Directions</Button>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  Opening Hours This Week:
                </h3>
                <Card className="flex flex-col gap-2 py-2">
                  {fillEmptyDays(singleLocation.result.operational_hours)?.map(
                    (operational) => (
                      <div
                        key={operational.day_of_week}
                        className="flex flex-row place-content-between px-4"
                      >
                        <h3 className="text-lg font-medium">
                          {getDayName(operational.day_of_week)}
                        </h3>
                        <div className="flex gap-2">
                          <p className="text-muted-foreground md:text-lg">
                            {operational.opening_time === 'Closed' ? (
                              <span className="text-red-500">Closed</span>
                            ) : (
                              <span>
                                {operational.opening_time}-{' '}
                                {operational.closing_time}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </Card>
              </div>
            </div>

            <div className=" flex flex-col gap-2">
              <Separator className="my-2" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Facilities
              </h1>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {singleLocation.result.facilities?.map((facility, index) => (
                  <Card
                    key={index}
                    className="flex flex-col place-content-between"
                  >
                    <CardHeader className="p-3">
                      <AspectRatio ratio={4 / 3}>
                        <ImageWithFallback
                          src={facility.image_url || 'placeholder.svg'}
                          alt={facility.name}
                          fill
                          className="w-32 rounded-lg object-cover"
                        />
                      </AspectRatio>
                      <h3 className="text-lg font-medium">{facility.name}</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col p-3">
                      <div className="flex place-items-center gap-2 text-muted-foreground">
                        <User2 className="h-5 w-5" />
                        <p className="md:text-lg">
                          Capacity: {facility.capacity} people
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
